import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Select from 'react-select'
import * as Urql from 'urql'
import { useReactToPrint } from 'react-to-print'

import { accessTarget } from './access_target'

import { ImportStatus, Language, NormalizeType, Order, useNormalizedStopsQuery, useRemotesQuery, VersionOrderColumn } from '../graphql/generated/graphql'
import { TimetableTable } from './timetable'

export interface ColourOption {
  readonly value: string;
  readonly label: string;
}

function App() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [userInputted, setUserInputted] = useState<boolean>(false)

  const [fromSearchName, setFromSearchName] = useState(new URL(location.href).searchParams.get('fromName') ?? '')
  const [selectedFrom, setSelectedFromKey] = useState<{ label: string; key: string; value: string[] } | null>(null)

  const [toSearchName, setToSearchName] = useState(new URL(location.href).searchParams.get('toName') ?? '')
  const [selectedTo, setSelectedToKey] = useState<{ label: string; key: string; value: string[] } | null>(null)

  const handleExchange = useCallback(() => {
    setUserInputted(true)
    setFromSearchName(toSearchName)
    setSelectedFromKey(selectedTo)
    setToSearchName(fromSearchName)
    setSelectedToKey(selectedFrom)
  }, [fromSearchName, selectedFrom, toSearchName, selectedTo])

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
  const remoteUids = useMemo(() => remotes.data?.remotes.edges.map(remote => remote.versions.edges[0]?.uid).filter(e => e !== undefined) ?? [], [remotes.data])

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
  const fromStops = useMemo(() => (fromNormalizedStops.data?.normalizedStops ?? []).map((stop) => ({ label: stop.stops[0].name, key: stop.key, value: stop.stops.map(s => s.uid) })), [fromNormalizedStops.data])
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
  const toStops = useMemo(() => (toNormalizedStops.data?.normalizedStops ?? []).map((stop) => ({ label: stop.stops[0].name, key: stop.key, value: stop.stops.map(s => s.uid) })), [toNormalizedStops.data])

  useEffect(() => {
    if (!fromSearchName || !toSearchName || !fromNormalizedStops.data || !toNormalizedStops.data || userInputted) return

    if (0 < fromNormalizedStops.data.normalizedStops.length) {
      const stop = fromNormalizedStops.data.normalizedStops[0]
      setFromSearchName(stop.stops[0].name)
      setUserInputted(true)
      setSelectedFromKey({
        label: stop.stops[0].name,
        key: stop.key,
        value: stop.stops.map(s => s.uid)
      })
    }

    if (0 < toNormalizedStops.data.normalizedStops.length) {
      const stop = toNormalizedStops.data.normalizedStops[0]
      setToSearchName(stop.stops[0].name)
      setUserInputted(true)
      setSelectedToKey({
        label: stop.stops[0].name,
        key: stop.key,
        value: stop.stops.map(s => s.uid)
      })
    }
  }, [fromNormalizedStops.data, toNormalizedStops.data])

  return (
    <>
      <div className='controller'>
        <Select
          className='fromName'
          filterOption={null}
          options={fromStops}
          value={selectedFrom}
          onInputChange={(v, actionMeta) => {
            if (['input-change', 'set-value'].includes(actionMeta.action) === false) return
            setUserInputted(true)
            setFromSearchName(v)
            setSelectedFromKey(null)
          }}
          onChange={(selectedOption) => {
            setUserInputted(true)
            setFromSearchName(selectedOption.label)
            setSelectedFromKey(selectedOption)
          }}
          placeholder='出発地'
        />
        <Select
          className='toName'
          filterOption={null}
          options={toStops}
          value={selectedTo}
          onInputChange={(v, actionMeta) => {
            if (['input-change', 'set-value'].includes(actionMeta.action) === false) return
            setUserInputted(true)
            setToSearchName(v)
            setSelectedToKey(null)
          }}
          onChange={(selectedOption) => {
            setUserInputted(true)
            setToSearchName(selectedOption.label)
            setSelectedToKey(selectedOption)
          }}
          placeholder='停車地'
        />
        <button className='exchange' onClick={handleExchange}>⇅</button>
        <button className='print' disabled={selectedFrom === null || selectedTo === null} onClick={handlePrint}>印刷する</button>
      </div>
      {
        selectedFrom && selectedTo &&
        <div ref={componentRef} >
          <TimetableTable fromStop={{ label: selectedFrom.label, key: selectedFrom.key, uids: selectedFrom.value }} toStop={{ label: selectedTo.label, key: selectedTo.key, uids: selectedTo.value }} />
        </div>
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
