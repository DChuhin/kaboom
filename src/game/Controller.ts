export interface GameController {
  addScore(amount: number): void
  makeBig(): void
}

/*
  event -> controller -> logic -> state -> view
  events:
    Keys
    Interactions


  event (kaboom) -> | side effects: controller -> logic -> state |

  Do DI for all kaboom deps (e.g spawn, moveHandler, jumpHandler)

  -> view
*/
