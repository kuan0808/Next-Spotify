# Next Spotify

Project Description

## Pending

- [ ] Next-auth authentication issues
  - [ ] Refreshed access token expiry time not updating

- [ ] SSR & Recoil states
  - [ ] Data for server side props too large
  - [ ] Compability issues: To much helper states in order to invalidate server side props

- [ ] Spotify API issues
  - [ ] Already use chaining promises to active a device, but still need to refresh the page after an unknown error
  - [ ] Request the current song after previous/next song operation, but always lag by 1

- [ ] Maybe switch to React-query hydration with SSR

## Completed ✓

- [x] Use SSR to reduce initial page flickering, hence better UX