import React, { useEffect, useRef } from "react";
import { useMemo } from "react";
import { useQRCode } from 'next-qrcode';
import { match } from 'ts-pattern'

import { useTimetableForBetweenStopsQuery } from "../graphql/generated/graphql";
import { timeStringToSeconds } from "./utils";


function isNullable(v: unknown) {
  return v === undefined || v === null
}

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
  moveTimeSec: number
}[]]

function stopTimeTransform(stopTime: ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetableForBetweenStops'][number][number]) {
  return match(stopTime)
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
}

function transform(transit: ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetableForBetweenStops'][number]) {
  const fromStopTime = stopTimeTransform(transit[0])
  const toStopTime = stopTimeTransform(transit[1])

  const routeName = fromStopTime.route.longName!
  const routeIds = routeName.includes('：') ? routeName.split('：')[0].split('/') : [fromStopTime.headsign.slice(0, 4)]

  const moveTimeSec = timeStringToSeconds(toStopTime.departure.time) - timeStringToSeconds(fromStopTime.departure.time)

  return {
    uid: fromStopTime.uid,
    departure: {
      hour: Number(fromStopTime.departure.time.split(':')[0]),
      minute: Number(fromStopTime.departure.time.split(':')[1])
    },
    routeIds: routeIds,
    moveTimeSec: moveTimeSec,
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
  fromStop: { label: string, key: string, uids: string[]; }
  toStop: { label: string, key: string, uids: string[]; }
}) {
  const { Canvas } = useQRCode();

  const propsLastChangedAt = useRef<number>(0);
  const timetableLastChangedAt = useRef<number>(0);

  useEffect(() => {
    propsLastChangedAt.current = new Date().valueOf();
  }, [props.fromStop.label, props.toStop.label]);

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
    if (isNullable(monday.data) || isNullable(saturday.data) || isNullable(sunday.data)) return null
    if (monday.data.timetableForBetweenStops.length === 0 && saturday.data.timetableForBetweenStops.length === 0 && sunday.data.timetableForBetweenStops.length === 0) return []

    const days = [
      timetableArray((monday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit))) as TimeTableData[],
      timetableArray((saturday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit))) as TimeTableData[],
      timetableArray((sunday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit))) as TimeTableData[],
    ]

    let minHour = 23
    days.forEach(timetable => {
      if (timetable.length === 0) return
      if (timetable[0][0] < minHour) minHour = timetable[0][0]
    })
    days.forEach(timetable => {
      if (timetable.length === 0) {
        timetable.unshift([minHour, []])

        return
      }

      const minHourDiff = timetable[0][0] - minHour
      for (let i = 0; i < minHourDiff; i++) {
        timetable.unshift([timetable[0][0] - 1, []])
      }
    })

    let maxHour = 0
    days.forEach(timetable => {
      if (maxHour < timetable[timetable.length - 1][0]) maxHour = timetable[timetable.length - 1][0]
    })
    days.forEach(timetable => {
      const maxHourDiff = maxHour - timetable[timetable.length - 1][0]
      for (let i = 0; i < maxHourDiff; i++) {
        timetable.push([timetable[timetable.length - 1][0] + 1, []])
      }
    })

    if (days[0].length !== days[1].length || days[1].length !== days[2].length) return []

    const result: [number, [TimeTableData[1], TimeTableData[1], TimeTableData[1]]][] = []
    days[0].forEach((_, i) => [
      result.push([days[0][i][0], [days[0][i][1], days[1][i][1], days[2][i][1]]])
    ])
    return result
  }, [monday.data, saturday.data, sunday.data])

  const moveCenterTimeSec = useMemo(() => {
    if (isNullable(monday.data) || isNullable(saturday.data) || isNullable(sunday.data)) return null

    const moveCenterTimes =
      [
        ...(monday.data?.timetableForBetweenStops ?? []),
        ...(saturday.data?.timetableForBetweenStops ?? []),
        ...(sunday.data?.timetableForBetweenStops ?? [])
      ].map((transit) => transform(transit).moveTimeSec).sort((a, b) => a - b)

    const half = Math.floor(moveCenterTimes.length / 2);

    if (moveCenterTimes.length % 2) {
      return moveCenterTimes[half];
    } else {
      return (moveCenterTimes[half - 1] + moveCenterTimes[half]) / 2;
    }
  }, [monday.data, saturday.data, sunday.data])

  useEffect(() => {
    timetableLastChangedAt.current = new Date().valueOf();
  }, [timetables, moveCenterTimeSec]);

  if (timetables === null || timetableLastChangedAt.current < propsLastChangedAt.current)
    return (
      <div>
        時刻表を生成中です... しばらくお待ち下さい
      </div>
    )

  const url = new URL(location.href);
  url.searchParams.set('fromName', props.fromStop.label)
  url.searchParams.set('toName', props.toStop.label)
  history.replaceState(null, null, url.href)

  if (timetables.length === 0) return (
    <div>
      この停留所区間は運行しておりません
    </div>
  )

  return (
    <div className='timetable'>
      <div className='timetable_header'>
        <div className='timetable_header_route_name'>{props.fromStop.label} → {props.toStop.label}</div>
        <div className='timetable_header_description'>所要約 <span className='timetable_header_description_minutes'>{moveCenterTimeSec / 60}</span> 分（経路・時間帯・交通状況により前後します）<>< br /><span>下線細字：所要時間が長い便です</span></></div>
        <div className='timetable_header_qr_description'><div className="center">リアル<br />タイム<br />情報▶</div></div>
        <div className="timetable_header_qr">
          <Canvas
            text={`https://km.bus-vision.jp/kumamoto/view/approach.html?stopCdFrom=${props.fromStop.key}&stopCdTo=${props.toStop.key}`}
            options={{
              type: 'image/png',
              quality: 1,
              level: 'M',
              margin: 4,
              scale: 2,
              color: {
                dark: '#000000FF',
                light: '#FFFFFFFF',
              },
            }}
          />
        </div>
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

            <div className="table_header_hour_right">時</div>
          </div>
          {timetables.map(([hour, timetable], hourIndex) => <>
            <div className="hour_group">
              <div className="hour">{String(hour).padStart(2, '0')}</div>

              <div className="minutes_group">
                {timetable.map((minutes, i) => {
                  const dayName = i === 0 ? 'weekday' : i === 1 ? 'saturday' : 'sunday'

                  return <div className={`minutes ${dayName} ${dayName}_${hourIndex % 2}`}>
                    {minutes.map((minute) => {
                      // 中央値×2.0以上 AND 中央値+20以上 → 除外　…桜町→市役所で52分などは除外される
                      if (moveCenterTimeSec * 2.0 <= minute.moveTimeSec && moveCenterTimeSec + 60 * 20 <= minute.moveTimeSec) return

                      // 中央値×1.5以上 AND 中央値+10以上 → 色づけ　…中央病院、健軍・県庁周りが色づけ
                      const minute_style = moveCenterTimeSec * 1.5 <= minute.moveTimeSec && moveCenterTimeSec + 60 * 10 <= minute.moveTimeSec ? 'long_time' : ''

                      return (
                        <div key={minute.uid} className="minute_wrap">
                          <div className={`minute ${minute_style}`}>{String(minute.departure.minute).padStart(2, '0')}</div>
                          <div className="route_id"><div style={{ fontSize: '3pt' }}>{minute.routeIds.join('/')}</div></div>
                        </div>
                      )
                    })}
                  </div>
                })}

                <div className="hour_right">
                  <div className="center">
                    {String(hour).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </>)}
        </div>
      </div>
    </div >
  )
}
