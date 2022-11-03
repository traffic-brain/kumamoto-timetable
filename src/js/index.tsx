import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Select from 'react-select'
import * as Urql from 'urql'
import { useReactToPrint } from 'react-to-print'

import { accessTarget } from './access_target'

import { ImportStatus, Language, NormalizeType, Order, useNormalizedStopsQuery, useRemotesQuery, VersionOrderColumn } from '../graphql/generated/graphql'
import { Timetable } from './timetable'

export interface ColourOption {
  readonly value: string;
  readonly label: string;
}

function App() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [fromSearchName, setFromSearchName] = useState('')
  const [selectedFrom, setSelectedFromKey] = useState<{ label: string; value: string[] } | null>(null)

  const [toSearchName, setToSearchName] = useState('')
  const [selectedTo, setSelectedToKey] = useState<{ label: string; value: string[] } | null>(null)

  const [remotes] = useRemotesQuery({
    variables: {
      where: {
        remoteUids: accessTarget.remoteUids
      },
      versionsWhere: {
        status: [ImportStatus.Imported]
      },
      versionsPagination: {
        offset: 0,
        limit: 1
      },
      versionOrder: {
        column: VersionOrderColumn.CreatedAt,
        order: Order.Desc
      }
    }
  })
  const remoteUids = useMemo(() => remotes.data?.remotes.edges.map(remote => remote.versions.edges[0].uid) ?? [], [remotes.data])

  const [fromNormalizedStops] = useNormalizedStopsQuery({
    variables: {
      where: {
        remoteVersionUids: remoteUids,
        type: NormalizeType.Id,
        languages: [Language.Ja, Language.En],
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
        remoteVersionUids: remoteUids,
        type: NormalizeType.Id,
        languages: [Language.Ja, Language.En],
        name: toSearchName,
      },
      pagination: {
        limit: 20
      },
    }
  })

  return (
    <>
      <div className='controller'>
        <Select
          className='fromName'
          filterOption={null}
          options={(fromNormalizedStops.data?.normalizedStops ?? []).map((stop) => ({ label: stop.stops[0].name, value: stop.stops.map(s => s.uid) }))}
          onInputChange={v => setFromSearchName(v)}
          onChange={(selectedOption) => {
            setSelectedFromKey(selectedOption)
          }}
          placeholder='出発地'
        />
        <Select
          className='toName'
          filterOption={null}
          options={(toNormalizedStops.data?.normalizedStops ?? []).map((stop) => ({ label: stop.stops[0].name, value: stop.stops.map(s => s.uid) }))}
          onInputChange={v => setToSearchName(v)}
          onChange={(selectedOption) => {
            setSelectedToKey(selectedOption)
          }}
          placeholder='停車地'
        />
        <button className='print' disabled={selectedFrom === null || selectedTo === null} onClick={handlePrint}>印刷する</button>
      </div>
      {
        selectedFrom && selectedTo &&
        <>
          <div ref={componentRef} className='timetable'>
            <div className='timetable_header'>
              <div className='timetable_header_route_name'>{selectedFrom.label} → {selectedTo.label}</div>
              <div className='timetable_header_warning'>※乗車する時間帯や経路によって乗車時間が異なる場合がございます。</div>
            </div>
            <div style={{
              width: '100%',
              display: 'flex',
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
