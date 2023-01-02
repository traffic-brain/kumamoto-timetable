const accessTargets = {
  dev: {
    medas: {
      url: 'http://localhost:3000/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiI2VDRvZXFZLTBma24xS2NrYm1ORDgiLCJ0b2tlbiI6InUwSXNBTURuakJqMl80R2ltWnFTVCIsImlhdCI6MTY3MjY2MTc5NX0.Xk4auSHuLuN5YpAKH1qIFGlIm4kCGCMfiVhfHcY0V7U',
    },
    remoteUids: [
      'nQnmRWWnFBTpUK102mFWK',
      'VQZ4LQIHfxpDnVaRzmtnf',
      'PYNnU1At5VNsGDN5bU_JR',
      'hB3vGaDFcXqL7A3t0ZASK',
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

export const accessTarget = accessTargets['dev']
