import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccessCredential = {
  __typename?: 'AccessCredential';
  access_token: Scalars['String'];
};

export type AuthCredential = {
  __typename?: 'AuthCredential';
  access_token: Scalars['String'];
};

export enum ImportErrorCode {
  FetchError = 'FETCH_ERROR',
  FetchTimeout = 'FETCH_TIMEOUT',
  InvalidGtfsFormat = 'INVALID_GTFS_FORMAT',
  InvalidZipFormat = 'INVALID_ZIP_FORMAT',
  RemoteAccessDenied = 'REMOTE_ACCESS_DENIED',
  RemoteNotFound = 'REMOTE_NOT_FOUND',
  Unknown = 'UNKNOWN'
}

export enum ImportErrorStatus {
  Error = 'ERROR'
}

export enum ImportStatus {
  Error = 'ERROR',
  Imported = 'IMPORTED',
  Initializing = 'INITIALIZING',
  LinkImporting = 'LINK_IMPORTING',
  Pending = 'PENDING',
  RawImporting = 'RAW_IMPORTING',
  Skip = 'SKIP'
}

export enum ImportSuccessStatus {
  Imported = 'IMPORTED',
  Initializing = 'INITIALIZING',
  LinkImporting = 'LINK_IMPORTING',
  Pending = 'PENDING',
  RawImporting = 'RAW_IMPORTING',
  Skip = 'SKIP'
}

export enum Language {
  En = 'en',
  Ja = 'ja'
}

export type LocationInfo = {
  __typename?: 'LocationInfo';
  lat: Scalars['Float'];
  lon: Scalars['Float'];
};

export type LoginCredential = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  generateAccessToken: AccessCredential;
  login: AuthCredential;
  userRegister: UserInfo;
};


export type MutationLoginArgs = {
  credential: LoginCredential;
};


export type MutationUserRegisterArgs = {
  credential: UserRegisterInput;
};

export enum NormalizeType {
  Id = 'ID',
  Name = 'NAME'
}

export type NormalizedStopInfo = {
  __typename?: 'NormalizedStopInfo';
  key: Scalars['String'];
  stops: Array<StopUnion>;
};

export type NormalizedStopPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type NormalizedStopSearch = {
  key?: InputMaybe<Scalars['String']>;
  languages: Array<Language>;
  name?: InputMaybe<Scalars['String']>;
  remoteVersionUids: Array<Scalars['String']>;
  type: NormalizeType;
};

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PlatformInfo = {
  __typename?: 'PlatformInfo';
  code?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  normalizedStops: Array<NormalizedStopInfo>;
  remotes: RemotePagination;
  stops: Array<StopUnion>;
  timetableForBetweenStops: Array<Array<StopTimeUnion>>;
};


export type QueryNormalizedStopsArgs = {
  pagination?: InputMaybe<NormalizedStopPagination>;
  where: NormalizedStopSearch;
};


export type QueryRemotesArgs = {
  pagination?: InputMaybe<RemotePaginationOptions>;
  where: RemoteSearch;
};


export type QueryStopsArgs = {
  pagination?: InputMaybe<StopPagination>;
  where: StopSearch;
};


export type QueryTimetableForBetweenStopsArgs = {
  where: TimetableForBetweenStopsSearch;
};

export type RemoteInfo = {
  __typename?: 'RemoteInfo';
  name: Scalars['String'];
  uid: Scalars['String'];
  versions: VersionPagination;
};


export type RemoteInfoVersionsArgs = {
  order?: InputMaybe<VersionOrder>;
  pagination?: InputMaybe<VersionPaginationOptions>;
  where?: InputMaybe<VersionSearch>;
};

export type RemotePagination = {
  __typename?: 'RemotePagination';
  edges: Array<RemoteInfo>;
  totalCount: Scalars['Int'];
};

export type RemotePaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type RemoteSearch = {
  name?: InputMaybe<Scalars['String']>;
  remoteUids?: InputMaybe<Array<Scalars['String']>>;
};

export type RouteInfo = {
  __typename?: 'RouteInfo';
  longName?: Maybe<Scalars['String']>;
  uid: Scalars['String'];
};

export type StopInfo = {
  __typename?: 'StopInfo';
  code?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  location: LocationInfo;
  name: Scalars['String'];
  platform?: Maybe<PlatformInfo>;
  timezone: Scalars['String'];
  uid: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  wheelchairBoarding: WheelchairBoarding;
};

export type StopPagination = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type StopSearch = {
  languages: Array<Language>;
  name?: InputMaybe<Scalars['String']>;
  remoteVersionUids: Array<Scalars['String']>;
};

export type StopTimeArrivalInfo = {
  __typename?: 'StopTimeArrivalInfo';
  arrival: Time;
  departure?: Maybe<Time>;
  headsign?: Maybe<Scalars['String']>;
  route: RouteInfo;
  stop: StopUnion;
  uid: Scalars['String'];
};

export type StopTimeDepartureInfo = {
  __typename?: 'StopTimeDepartureInfo';
  arrival?: Maybe<Time>;
  departure: Time;
  headsign?: Maybe<Scalars['String']>;
  route: RouteInfo;
  stop: StopUnion;
  uid: Scalars['String'];
};

export type StopTimeInfo = {
  __typename?: 'StopTimeInfo';
  arrival: Time;
  departure: Time;
  headsign?: Maybe<Scalars['String']>;
  route: RouteInfo;
  stop: StopUnion;
  uid: Scalars['String'];
};

export type StopTimeUnion = StopTimeArrivalInfo | StopTimeDepartureInfo | StopTimeInfo;

export type StopUnion = StopInfo;

export enum SupportType {
  Agency = 'AGENCY',
  Attribution = 'ATTRIBUTION',
  Calendar = 'CALENDAR',
  CalendarDate = 'CALENDAR_DATE',
  FareAttribute = 'FARE_ATTRIBUTE',
  FareRule = 'FARE_RULE',
  FeedInfo = 'FEED_INFO',
  Frequence = 'FREQUENCE',
  Level = 'LEVEL',
  Pathway = 'PATHWAY',
  Route = 'ROUTE',
  Shape = 'SHAPE',
  Stop = 'STOP',
  StopTime = 'STOP_TIME',
  Transfer = 'TRANSFER',
  Translation = 'TRANSLATION',
  Trip = 'TRIP'
}

export type Time = {
  __typename?: 'Time';
  time: Scalars['String'];
};

export type TimetableForBetweenStopsSearch = {
  date: Scalars['String'];
  transitStopUids: Array<Array<Scalars['String']>>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email: Scalars['String'];
};

export type UserRegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type VersionErrorInfo = {
  __typename?: 'VersionErrorInfo';
  created_at: Scalars['String'];
  data_portal_url: Scalars['String'];
  import_error_code: ImportErrorCode;
  import_status: ImportErrorStatus;
  realtime_data_urls: Array<Scalars['String']>;
  static_data_url: Scalars['String'];
  support_types: Array<SupportType>;
  uid: Scalars['String'];
};

export type VersionInfo = {
  __typename?: 'VersionInfo';
  created_at: Scalars['String'];
  data_portal_url: Scalars['String'];
  import_status: ImportSuccessStatus;
  realtime_data_urls: Array<Scalars['String']>;
  static_data_url: Scalars['String'];
  support_types: Array<SupportType>;
  uid: Scalars['String'];
};

export type VersionInfoUnion = VersionErrorInfo | VersionInfo;

export type VersionOrder = {
  column: VersionOrderColumn;
  order: Order;
};

export enum VersionOrderColumn {
  CreatedAt = 'created_at'
}

export type VersionPagination = {
  __typename?: 'VersionPagination';
  edges: Array<VersionInfoUnion>;
  totalCount: Scalars['Int'];
};

export type VersionPaginationOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type VersionSearch = {
  status?: InputMaybe<Array<ImportStatus>>;
};

export enum WheelchairBoarding {
  Accessible = 'ACCESSIBLE',
  NoAccessible = 'NO_ACCESSIBLE',
  NoInformation = 'NO_INFORMATION'
}

export type RemotesQueryVariables = Exact<{
  where: RemoteSearch;
  pagination?: InputMaybe<RemotePaginationOptions>;
  versionsWhere: VersionSearch;
  versionsPagination?: InputMaybe<VersionPaginationOptions>;
  versionOrder?: InputMaybe<VersionOrder>;
}>;


export type RemotesQuery = { __typename?: 'Query', remotes: { __typename?: 'RemotePagination', edges: Array<{ __typename?: 'RemoteInfo', versions: { __typename?: 'VersionPagination', edges: Array<{ __typename?: 'VersionErrorInfo', uid: string } | { __typename?: 'VersionInfo', uid: string }> } }> } };

export type NormalizedStopsQueryVariables = Exact<{
  where: NormalizedStopSearch;
  pagination?: InputMaybe<NormalizedStopPagination>;
}>;


export type NormalizedStopsQuery = { __typename?: 'Query', normalizedStops: Array<{ __typename?: 'NormalizedStopInfo', key: string, stops: Array<{ __typename?: 'StopInfo', uid: string, id: string, name: string }> }> };

export type TimetableForBetweenStopsQueryVariables = Exact<{
  where: TimetableForBetweenStopsSearch;
}>;


export type TimetableForBetweenStopsQuery = { __typename?: 'Query', timetableForBetweenStops: Array<Array<{ __typename?: 'StopTimeArrivalInfo', headsign?: string | null, uid: string, a_departure?: { __typename?: 'Time', time: string } | null, route: { __typename?: 'RouteInfo', longName?: string | null, uid: string } } | { __typename?: 'StopTimeDepartureInfo', headsign?: string | null, uid: string, d_departure: { __typename?: 'Time', time: string }, route: { __typename?: 'RouteInfo', longName?: string | null, uid: string } } | { __typename?: 'StopTimeInfo', headsign?: string | null, uid: string, departure: { __typename?: 'Time', time: string }, route: { __typename?: 'RouteInfo', longName?: string | null, uid: string } }>> };


export const RemotesDocument = gql`
    query Remotes($where: RemoteSearch!, $pagination: RemotePaginationOptions, $versionsWhere: VersionSearch!, $versionsPagination: VersionPaginationOptions, $versionOrder: VersionOrder) {
  remotes(where: $where, pagination: $pagination) {
    edges {
      versions(
        where: $versionsWhere
        pagination: $versionsPagination
        order: $versionOrder
      ) {
        edges {
          ... on VersionErrorInfo {
            uid
          }
          ... on VersionInfo {
            uid
          }
        }
      }
    }
  }
}
    `;

export function useRemotesQuery(options: Omit<Urql.UseQueryArgs<RemotesQueryVariables>, 'query'>) {
  return Urql.useQuery<RemotesQuery, RemotesQueryVariables>({ query: RemotesDocument, ...options });
};
export const NormalizedStopsDocument = gql`
    query NormalizedStops($where: NormalizedStopSearch!, $pagination: NormalizedStopPagination) {
  normalizedStops(where: $where, pagination: $pagination) {
    key
    stops {
      ... on StopInfo {
        uid
        id
        name
      }
    }
  }
}
    `;

export function useNormalizedStopsQuery(options: Omit<Urql.UseQueryArgs<NormalizedStopsQueryVariables>, 'query'>) {
  return Urql.useQuery<NormalizedStopsQuery, NormalizedStopsQueryVariables>({ query: NormalizedStopsDocument, ...options });
};
export const TimetableForBetweenStopsDocument = gql`
    query TimetableForBetweenStops($where: TimetableForBetweenStopsSearch!) {
  timetableForBetweenStops(where: $where) {
    ... on StopTimeArrivalInfo {
      a_departure: departure {
        time
      }
      headsign
      route {
        longName
        uid
      }
      uid
    }
    ... on StopTimeDepartureInfo {
      d_departure: departure {
        time
      }
      headsign
      route {
        longName
        uid
      }
      uid
    }
    ... on StopTimeInfo {
      departure {
        time
      }
      headsign
      route {
        longName
        uid
      }
      uid
    }
  }
}
    `;

export function useTimetableForBetweenStopsQuery(options: Omit<Urql.UseQueryArgs<TimetableForBetweenStopsQueryVariables>, 'query'>) {
  return Urql.useQuery<TimetableForBetweenStopsQuery, TimetableForBetweenStopsQueryVariables>({ query: TimetableForBetweenStopsDocument, ...options });
};