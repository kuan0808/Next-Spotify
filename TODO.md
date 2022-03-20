# Next Spotify

Project Description

## Issues❓

- [ ] Next-auth authentication issues
  - [ ] Refreshed access token expiry time not updating

- [ ] SSR & Recoil states
  - [ ] Data for server side props too large
  - [ ] Compability issues: To much helper states in order to invalidate server side props

## Future works

- [ ] Switch to React-query hydration with SSR
- [ ] Use Spotify web playback SDK instead of manipulate active device or both
- [ ] Search tracks functionality
- [ ] More Spotify operations, eg. add playlists, favorite...etc

## Completed ✓

- [x] Use SSR to reduce initial page flickering, hence better UX

- [x] Spotify API issues
  - [x] Already use chaining promises to active a device, but still need to refresh the page after an unknown error
        - Fixed the promise chain so that it performs properly now
  - [x] Request the current song after previous/next song operation, but always lag by 1
        - Use setTimeout to prevent getting the lagged result
  - [x] After manually play/pause track on the playlist, the skip/previous operation don't work anymore
        - Use playlist's uri & position instead of track's uri while requesting to play a track
