import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Select from 'react-select'
import * as Urql from 'urql'
import { accessTarget } from './access_target'

import { Language, NormalizeType, useNormalizedStopsQuery } from './graphql/generated/graphql'
import { Timetable } from './timetable'

export interface ColourOption {
  readonly value: string;
  readonly label: string;
}

function App() {
  const [fromSearchName, setFromSearchName] = useState('')
  const [selectedFrom, setSelectedFromKey] = useState<{ label: string; value: string[] } | null>(null)

  const [toSearchName, setToSearchName] = useState('')
  const [selectedTo, setSelectedToKey] = useState<{ label: string; value: string[] } | null>(null)

  const [fromNormalizedStops] = useNormalizedStopsQuery({
    variables: {
      where: {
        remoteVersionUids: accessTarget.remoteUids,
        type: NormalizeType.Id,
        languages: [Language.En, Language.Ja],
        name: fromSearchName,
      },
      pagination: {
        limit: 20
      },
    }
  })
  const [toNormalizedStops] = useNormalizedStopsQuery({
    variables: {
      where: {
        remoteVersionUids: accessTarget.remoteUids,
        type: NormalizeType.Id,
        languages: [Language.En, Language.Ja],
        name: toSearchName,
      },
      pagination: {
        limit: 20
      },
    }
  })

  return (
    <>
      <Select
        options={(fromNormalizedStops.data?.normalizedStops ?? []).map((stop) => ({ label: stop.stops[0].name, value: stop.stops.map(s => s.uid) }))}
        onInputChange={v => setFromSearchName(v)}
        onChange={(selectedOption) => {
          setSelectedFromKey(selectedOption)
        }}
        placeholder='出発地'
      />
      <Select
        options={(toNormalizedStops.data?.normalizedStops ?? []).map((stop) => ({ label: stop.stops[0].name, value: stop.stops.map(s => s.uid) }))}
        onInputChange={v => setToSearchName(v)}
        onChange={(selectedOption) => {
          setSelectedToKey(selectedOption)
        }}
        placeholder='停車地'
      />
      {
        selectedFrom && selectedTo &&
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div>{selectedFrom.label} → {selectedTo.label}</div>
            <div>※乗車する時間帯や経路によって乗車時間が異なる場合がございます。</div>
          </div>
          <div style={{
            display: 'flex',
          }}>

            <div style={{
              border: '1px solid #000',
            }}>
              <Timetable fromStopUids={selectedFrom.value} toStopUids={selectedTo.value} hour />
            </div>
          </div>
        </>
      }
    </>
  )
}

const client = Urql.createClient({
  url: accessTarget.medas.url,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${accessTarget.medas.accessToken}`
    },
  },
})

const element = document.getElementById('root')
const root = createRoot(element)
root.render(<Urql.Provider value={client}><App /></Urql.Provider>)
