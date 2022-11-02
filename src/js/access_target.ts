const accessTargets = {
  develop: {
    medas: {
      url: 'http://localhost:3000/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiI5d2Z2c3BxUGJrMktIeURUTUZzekMiLCJ0b2tlbiI6IjFfdW50MElmZF9zdE4xN1hqamQ3TiIsImlhdCI6MTY2Njk3MjY2NH0._JX8XeM9I8khY_1wdx544FAuLE228U8v4wesmbPnMnU',
    },
    remoteUids: [
      "v0Wgb4slostqTmxfq7mWc",
      "k0jekEyTT3-PWjJ9t4fN8",
      "8CrK0at6O-Wg-XT5qgLts",
      "-pwd-uGrjGaBaNZ_fOxua",
      "yv3M5vVIBaH4irKk2nZBu"
    ]
  },
  prod: {
    medas: {
      url: 'https://api.medas.cloud/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiJPWWFKSUlPQWVuLVNnT0ZTM0MxLUoiLCJ0b2tlbiI6IkxuejdPdVRCbXNTdk00NXhnUlQyTSIsImlhdCI6MTY2NzExMTkxM30.haHaEYhyneClNRYC8XwvWAULsr1McIHJSqwcdlb3XOQ',
    },
    remoteUids: [
      'spmtfpCLMHX90MM7xnhtu',
      'JcxG9RikQzXzu0zccQmHJ',
      'tNF5k_mA6Z9JuC6u-TF45',
      'Dq-4U8eKuThPQWXQL744p',
    ]
  }
}

export const accessTarget = accessTargets['prod']
