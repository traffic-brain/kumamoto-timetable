import React from "react";
import { useMemo } from "react";
import { match } from 'ts-pattern'

import { useTimetableForBetweenStopsQuery } from "./graphql/generated/graphql";

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
      route: stopTime.route
    }))
    .with({ __typename: 'StopTimeDepartureInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.d_departure,
      route: stopTime.route
    }))
    .with({ __typename: 'StopTimeInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.departure,
      route: stopTime.route
    }))
    .run()

  return {
    uid: stopTime.uid,
    departure: {
      hour: Number(stopTime.departure.time.split(':')[0]),
      minute: Number(stopTime.departure.time.split(':')[1])
    },
    routeIds: stopTime.route.longName!.split('：')[0].split('／')
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

export function TimetableDataProcessor(props: { fromStopUids: string[]; toStopUids: string[] }) {
  const [monday] = useTimetableForBetweenStopsQuery({
    variables: {
      where: {
        transitStopUids: [props.fromStopUids, props.toStopUids],
        date: generateDateFormat(nextDay(1))
      }
    }
  })
  const [saturday] = useTimetableForBetweenStopsQuery({
    variables: {
      where: {
        transitStopUids: [props.fromStopUids, props.toStopUids],
        date: generateDateFormat(nextDay(6))
      }
    }
  })
  const [sunday] = useTimetableForBetweenStopsQuery({
    variables: {
      where: {
        transitStopUids: [props.fromStopUids, props.toStopUids],
        date: generateDateFormat(nextDay(0))
      }
    }
  })

  const timetables = useMemo(() => {
    console.log(monday.data, saturday.data, sunday.data)
    if (!monday.data || !saturday.data || !sunday.data) return null

    const mondayRows = timetableArray((monday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit[0]))) as TimeTableData[]
    const saturdayRows = timetableArray((saturday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit[0]))) as TimeTableData[]
    const sundayRows = timetableArray((sunday.data?.timetableForBetweenStops ?? []).map((transit) => transform(transit[0]))) as TimeTableData[]

    const data = [mondayRows, saturdayRows, sundayRows]

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
    console.log(data)
    if (data[0].length !== data[1].length || data[1].length !== data[2].length) return []

    const result: [number, [TimeTableData[1], TimeTableData[1], TimeTableData[1]]][] = []
    data[0].forEach((_, i) => [
      result.push([data[0][i][0], [data[0][i][1], data[1][i][1], data[2][i][1]]])
    ])
    return result
  }, [monday.data, saturday.data, sunday.data])

  if (timetables === null) return (
    <div>
      時刻表生成中です... しばらくお待ち下さい
    </div>
  )

  if (timetables.length === 0) return (
    <div>
      この停留所区間は運行しておりません
    </div>
  )

  return <>
    <div style={{
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      borderBottom: '1px solid #000',
    }}>
      <div style={{
        fontSize: '15pt',
        padding: '0 6pt',
      }}>時</div>

      <div style={{
        display: 'flex',
      }}>
        <div style={{
          borderLeft: '1px solid #000',
          width: '32vw',
        }}>
          平日（{generateDateFormat(nextDay(1), '/')}）
        </div>
        <div style={{
          borderLeft: '1px solid #000',
          width: '32vw',
        }}>
          土曜（{generateDateFormat(nextDay(6), '/')}）
        </div>
        <div style={{
          borderLeft: '1px solid #000',
          width: '32vw',
        }}>
          日祝（{generateDateFormat(nextDay(0), '/')}）
        </div>
      </div>
    </div>
    {timetables.map(([hour, timetable]) => <>
      <div style={{
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderBottom: '1px solid #000',
      }}>
        <div style={{
          fontSize: '15pt',
          padding: '0 4pt',
        }}>{String(hour).padStart(2, '0')}</div>

        <div style={{
          display: 'flex',
          height: 'fit-content',
        }}>
          {timetable.map((minutes, i) =>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
              gap: '10pt',
              width: '32vw',
              borderLeft: '1px solid #000',
              backgroundColor: i === 0 ? '#efefef' : i === 1 ? '#d4ebff' : '#ffcee6'
            }}>
              {minutes.map((minute) =>
                <div key={minute.uid} style={{
                  width: 'fit-content',
                  padding: '5pt',
                }}>
                  <div style={{ fontSize: '16pt', textAlign: 'center' }}>{String(minute.departure.minute).padStart(2, '0')}</div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6pt',
                    marginTop: '-5pt',
                  }}>{minute.routeIds.map(routeId => <span style={{ fontSize: '3pt' }}>{routeId}</span>)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>)}
  </>
}
