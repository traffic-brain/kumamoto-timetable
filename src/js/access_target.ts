const accessTargets = {
  dev: {
    medas: {
      url: 'http://localhost:3000/v1/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiJpVi1qcW4yQ0ZQb1Z3am9oWHVjODMiLCJ0b2tlbiI6ImxHZVQ5VlQxWWpZeVdmbFc5UWhteiIsImlhdCI6MTY2NzQwNjM4OH0.MFYVPU45id64WDRidkynTA87k5jxb6-BgQV7eDFpiNY',
    },
    remoteUids: [
      'jHCEK7BU2AtQ7tEiFIvNl',
      'Ccbxg6MMp2Opj5IwHBtga',
      'ocG3Giv5Z9C2TNeLLjZ_9',
      'y90bXyuVcz6-xsBoPaWg0',
    ]
  },
  prod: {
    medas: {
      url: 'https://api.medas.cloud/graphql',
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
