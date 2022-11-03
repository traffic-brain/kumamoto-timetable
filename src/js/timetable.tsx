import React, { useEffect, useRef } from "react";
import { useMemo } from "react";
import { match } from 'ts-pattern'

import { useTimetableForBetweenStopsQuery } from "../graphql/generated/graphql";
import { timeStringToSeconds } from "./utils";

function nextDay(x: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  var now = new Date();
  now.setDate(now.getDate() + (x + (7 - now.getDay())) % 7);
  return now;
}

function generateDateFormat(date: Date, split: string = '-') {
  return `${date.getFullYear()}${split}${String(date.getMonth() + 1).padStart(2, '0')}${split}${String(date.getDate()).padStart(2, '0')}`
}

type TimeTableData = [number, {
  uid: string;
  departure: {
    hour: number;
    minute: number;
  };
  routeIds: string[]
}[]]

function transform(transit: ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetableForBetweenStops'][number][number]) {
  const stopTime = match(transit)
    .with({ __typename: 'StopTimeArrivalInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.a_departure,
      route: stopTime.route,
      headsign: stopTime.headsign,
    }))
    .with({ __typename: 'StopTimeDepartureInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.d_departure,
      route: stopTime.route,
      headsign: stopTime.headsign,
    }))
    .with({ __typename: 'StopTimeInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.departure,
      route: stopTime.route,
      headsign: stopTime.headsign,
    }))
    .run()

  const routeName = stopTime.route.longName!
  const routeIds = routeName.includes('：') ? routeName.split('：')[0].split('/') : [stopTime.headsign.slice(0, 4)]

  return {
    uid: stopTime.uid,
    departure: {
      hour: Number(stopTime.departure.time.split(':')[0]),
      minute: Number(stopTime.departure.time.split(':')[1])
    },
    routeIds: routeIds
  }
}

function timetableArray(rows: ReturnType<typeof transform>[]) {
  const result2: typeof rows[number][][] = [[]]
  rows.forEach((row) => {
    const prev = result2[result2.length - 1][result2[result2.length - 1].length - 1]
    if (prev === undefined) {
      result2[result2.length - 1][result2[result2.length - 1].length] = row
      return
    }

    const hourDiff = row.departure.hour - prev.departure.hour
    for (let i = 0; i < hourDiff; i++) {
      result2.push([])
    }

    result2[result2.length - 1].push(row)
  })

  if (result2[0].length === 0) return []

  const minHour = result2[0][0].departure.hour
  const result3 = result2.map((stopTimes, i) => ([minHour + i, stopTimes]))

  return result3
}

export function TimetableTable(props: {
  fromStop: { label: string, uids: string[]; }
  toStop: { label: string, uids: string[]; }
}) {
  const propsLastChangedAt = useRef<number>(0);
  const timetableLastChangedAt = useRef<number>(0);

  useEffect(() => {
    propsLastChangedAt.current = new Date().valueOf();
  }, [props]);

  const [monday] = useTimetableForBetweenStopsQuery({
    variables: {
      where: {
        transitStopUids: [props.fromStop.uids, props.toStop.uids],
        date: generateDateFormat(nextDay(1))
      }
    }
  })
  const [saturday] = useTimetableForBetweenStopsQuery({
    variables: {
      where: {
        transitStopUids: [props.fromStop.uids, props.toStop.uids],
        date: generateDateFormat(nextDay(6))
      }
    }
  })
  const [sunday] = useTimetableForBetweenStopsQuery({
    variables: {
      where: {
        transitStopUids: [props.fromStop.uids, props.toStop.uids],
        date: generateDateFormat(nextDay(0))
      }
    }
  })

  const timetables = useMemo(() => {
    if (!monday.data || !saturday.data || !sunday.data) return null

    const data = [
      timetableArray((monday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit[0]))) as TimeTableData[],
      timetableArray((saturday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit[0]))) as TimeTableData[],
      timetableArray((sunday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit[0]))) as TimeTableData[],
    ]

    let minHour = 23
    data.forEach(data => {
      if (data.length === 0) return
      if (data[0][0] < minHour) minHour = data[0][0]
    })
    data.forEach(data => {
      if (data.length === 0) return

      const minHourDiff = data[0][0] - minHour
      for (let i = 0; i < minHourDiff; i++) {
        data.unshift([data[0][0] - i - 1, []])
      }
    })

    let maxHour = 0
    data.forEach(data => {
      if (data.length === 0) return
      if (maxHour < data[data.length - 1][0]) maxHour = data[data.length - 1][0]
    })
    data.forEach(data => {
      if (data.length === 0) return

      const maxHourDiff = maxHour - data[data.length - 1][0]
      for (let i = 0; i < maxHourDiff; i++) {
        data.push([data[data.length - 1][0] + i + 1, []])
      }
    })
    if (data[0].length !== data[1].length || data[1].length !== data[2].length) return []

    const result: [number, [TimeTableData[1], TimeTableData[1], TimeTableData[1]]][] = []
    data[0].forEach((_, i) => [
      result.push([data[0][i][0], [data[0][i][1], data[1][i][1], data[2][i][1]]])
    ])
    return result
  }, [monday.data, saturday.data, sunday.data])

  const moveTime = useMemo(() => {
    if (!monday.data || !saturday.data || !sunday.data) return null

    let moveMinSeconds = Number.MAX_SAFE_INTEGER;
    let moveMaxSeconds = 0;
    [
      ...(monday.data?.timetableForBetweenStops ?? []),
      ...(saturday.data?.timetableForBetweenStops ?? []),
      ...(sunday.data?.timetableForBetweenStops ?? [])
    ].forEach(([from, to]) => {
      const fromData = transform(from)
      const toData = transform(to)

      const moveTime = timeStringToSeconds(`${toData.departure.hour}:${toData.departure.minute}:00`) - timeStringToSeconds(`${fromData.departure.hour}:${fromData.departure.minute}:00`)
      if (moveTime < 0) debugger
      if (moveTime < moveMinSeconds) moveMinSeconds = moveTime
      if (moveMaxSeconds < moveTime) moveMaxSeconds = moveTime
    })
    console.log(`乗車時間 約${moveMinSeconds / 60}分〜約${moveMaxSeconds / 60}分`)

    return {
      min: moveMinSeconds,
      max: moveMaxSeconds
    }
  }, [monday.data, saturday.data, sunday.data])

  useEffect(() => {
    timetableLastChangedAt.current = new Date().valueOf();
  }, [timetables]);

  if (timetables === null || timetableLastChangedAt.current < propsLastChangedAt.current) return (
    <div>
      時刻表を生成中です... しばらくお待ち下さい
    </div>
  )

  if (timetables.length === 0) return (
    <div>
      この停留所区間は運行しておりません
    </div>
  )

  return (
    <div className='timetable'>
      <div className='timetable_header'>
        <div className='timetable_header_route_name'>{props.fromStop.label} → {props.toStop.label}</div>
        <div className='timetable_header_description'>所要 <span className='timetable_header_description_minutes'>7～16</span> 分（交通状況などにより前後します）</div>
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
      }}>
        <div className="table">
          <div className="table_header">
            <div className="table_header_hour">時</div>

            <div className="table_header_col_wrap">
              <div className="table_header_col weekday">
                <span className="day_name">平日</span><span className="day">（{generateDateFormat(nextDay(1), '/')}）</span>
              </div>
              <div className="table_header_col saturday">
                <span className="day_name">土曜</span><span className="day">（{generateDateFormat(nextDay(6), '/')}）</span>
              </div>
              <div className="table_header_col sunday">
                <span className="day_name">日祝</span><span className="day">（{generateDateFormat(nextDay(0), '/')}）</span>
              </div>
            </div>
          </div>
          {timetables.map(([hour, timetable], hourIndex) => <>
            <div className="hour_group">
              <div className="hour">{String(hour).padStart(2, '0')}</div>

              <div className="minutes_group">
                {timetable.map((minutes, i) => {
                  const dayName = i === 0 ? 'weekday' : i === 1 ? 'saturday' : 'sunday'
                  return <div className={`minutes ${dayName} ${dayName}_${hourIndex % 2}`}>
                    {minutes.map((minute) =>
                      <div key={minute.uid} className="minute_wrap">
                        <div className="minute">{String(minute.departure.minute).padStart(2, '0')}</div>
                        <div className="route_id"><div style={{ fontSize: '3pt' }}>{minute.routeIds.join('/')}</div></div>
                      </div>
                    )}
                  </div>
                })}
              </div>
            </div>
          </>)}
        </div>
      </div>
    </div>
  )
}
