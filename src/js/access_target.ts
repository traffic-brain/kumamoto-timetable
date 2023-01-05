const accessTargets = {
  dev: {
    medas: {
      url: 'http://localhost:3001/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiJTUE9zRUJYT2hxVlo5RHoxUkdISl8iLCJ0b2tlbiI6InZ4TjRqYVloNUN5VFpkRGd5SVUzSCIsImlhdCI6MTY3MjgzNzA0Mn0.PQeJlD0cW_8ze4LfqnImHTKlCKnvpgBOH6KOiqXhPhQ',
    },
    remoteUids: [
      'cHVaAq578jSxIj6nQli4e',
      'mJx0IOk2t5QvAPrcjXrXr',
      'WTxihaA-kKBkTf2HaK3zc',
      'ygXOrQkTVqhayh9-hALqH',
    ]
  },
  prod: {
    medas: {
      url: 'https://api.medas.cloud/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiJPWWFKSUlPQWVuLVNnT0ZTM0MxLUoiLCJ0b2tlbiI6IkxuejdPdVRCbXNTdk00NXhnUlQyTSIsImlhdCI6MTY2NzExMTkxM30.haHaEYhyneClNRYC8XwvWAULsr1McIHJSqwcdlb3XOQ',
    },
    remoteUids: [
      'jINOG7YK70vXkwlsgp1YT',
      '3yM00KPM2aw7PjtF_li1k',
      'WJQSpdRf1XpAyOQ8RQJGy',
      'bHxWm3b9Ttz6434y8JWpc',
    ]
  }
}

export const accessTarget = accessTargets['prod']
