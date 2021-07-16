import allowedUpdates from "../helpers/statusTransitions.json";

export class TaskStatus {

  static checkStatusUpdate(oldStatus: string, newStatus: string) {
    try {
      if ((<any>allowedUpdates)[oldStatus] && (<any>allowedUpdates)[oldStatus].indexOf(newStatus) > -1)
        return true
      return false;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  static getPossibleStatusChanges(status: string) {
    try {
      if ((<any>allowedUpdates)[status])
        return (<any>allowedUpdates)[status]
      throw 'Please Select Valid Status';
    } catch (error) {
      console.error(error);
      return error;
    }
  }

}