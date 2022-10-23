const accessTargets = {
  develop: {
    medas: {
      url: 'http://localhost:3000/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiJuUTF3WWFBT1JnM0c2TUkzangwUTAiLCJ0b2tlbiI6ImRLQVp1RWFQQm5STTFLYm9nN0ZNZCIsImlhdCI6MTY2NjQyMzk0MX0.r3bl0asfPt0DLQxjWq-TvWUvctshoRh3Faai7Sd0_zM',
    },
    remoteUids: [
      'UnY32X-S_yfPrRauQWSDn',
      'Qd6SJoQ-WC-tu7Kxm-_6d',
      '_1tYjlKj3sLV8Jdw0F0Wv',
      '6ufdhddZxTKMayZLe8kCt',
    ]
  },
  prod: {
    medas: {
      url: 'https://api.medas.cloud/graphql',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1aWQiOiI5WHg4Q2RneFdIUXVWajdnRWNMWWoiLCJ0b2tlbiI6IldqdnpIRVM1XzRwbVpGOFc1MDZqSSIsImlhdCI6MTY2NTk3NzIyMX0.9OJQiciU0FEdVsa0hZ497BrIQjBsQqrXKzHpM48jYcA'
    },
    remoteUids: [
      '1lO_sQ_z-7potlh5i_8yn',
      'EXkbTWCzO_cedKn_u2phs',
      'zTFGprmG4Tj3O3FD4a0Ne',
      'drrtiuTBEW0BFpE3S0shy',
    ]
  }
}

export const accessTarget = accessTargets['prod']
