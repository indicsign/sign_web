// The light player has no typings of its own; it is the same surface as the full
// build minus expressions, so it borrows the package's own player type.
declare module 'lottie-web/build/player/lottie_light' {
  import type { LottiePlayer } from 'lottie-web'
  const lottie: LottiePlayer
  export default lottie
}
