export class Constants {
  /* Physic constants */
  private static _gravity: number = 2000.0;
  private static _restitution: number = 1;
  private static _epsilon: number = 0.000009;

  public static get GRAVITY(): number {
    return Constants._gravity;
  }
  public static get RESTITUTION(): number {
    return Constants._restitution;
  }
  public static get EPSILON(): number {
    return Constants._epsilon;
  }
}
