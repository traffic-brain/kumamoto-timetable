import React from "react";

import { TimetableDataProcessor } from "./timetable_data_processor";

export function Timetable(props: { hour?: boolean; fromStopUids: string[], toStopUids: string[]; }) {
  return props.fromStopUids.length !== 0 &&
    props.toStopUids.length !== 0 &&
    <TimetableDataProcessor fromStopUids={props.fromStopUids} toStopUids={props.toStopUids} />
}
