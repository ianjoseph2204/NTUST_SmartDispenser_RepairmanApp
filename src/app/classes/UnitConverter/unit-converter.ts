export class UnitConverter {
    
  /**
   * This function is to convert the time from the API into Date
   * object in typescript library. The purpose is to create a new
   * Date object with data from the API. This function will return
   * Date object
   * 
   * @param     time    Value of time from API in "2019-03-08 16:32:00" format
   * 
   * @returns   Date    Date object converted result from time
   * 
   * @example
   * 
   * {
   *    "Year": 2019,
   *    "Month": 2,
   *    "DateOfMonth": 14,
   *    "Hour": 19,
   *    "Minute": 44,
   *    "Second": 11,
   * }
   */
  public static convertApiTimeToJson (time: string) {
    // time passed is String, construct into Date format
    // time example from json: "2019-03-08 16:32:00"
    // format: YEAR-MONTH-DATEOFMONTH HOUR:MINUTE:SECOND
    
    // split into DATE form and HOUR form
    let splitTime = time.split(" ");

      ////////////////////////////////////////////
     //  DATE PART                             //
    ////////////////////////////////////////////

    // resultDate = YEAR-MONTH-DATEOFMONTH
    let resultDate = splitTime[0];

    // split DATE into YEAR, MONTH, and DATEOFMONTH
    let splitDate = resultDate.split("-");

    let resultYear = splitDate[0];
    let resultMonth = splitDate[1];
    let resultDateOfMonth = splitDate[2];

      ////////////////////////////////////////////
     //  HOUR PART                             //
    ////////////////////////////////////////////

    // resultHour = HOUR:MINUTE:SECOND
    let resultHour = splitTime[1];

    // split HOUR into HOUR, MINUTE, and SECOND
    let splitHour = resultHour.split(":");

    let resultHourC = splitHour[0];
    let resultMinute = splitHour[1];
    let resultSecond = splitHour[2];

      ////////////////////////////////////////////
     //  CONSTRUCT DATE PART                   //
    ////////////////////////////////////////////

    // now we get every component to construct date into JSON format
    let newDate = {
      'Year': resultYear,
      'Month': resultMonth,
      'DateOfMonth': resultDateOfMonth,
      'Hour': resultHourC,
      'Minute': resultMinute,
      'Second': resultSecond
    };

    return newDate;
  }

  /**
   * This function is to convert the time from the API into Date
   * object in typescript library. The purpose is to create a new
   * Date object with data from the API. This function will return
   * Date object
   * 
   * @param     time    Value of time from API in "2019-03-08 16:32:00" format
   * 
   * @returns   Date    Date object converted result from time
   */
  public static convertApiTimeToDate (time: any) {
    // time passed is String, construct into Date format
    // time example from json: "2019-03-08 16:32:00"
    // format: YEAR-MONTH-DATEOFMONTH HOUR:MINUTE:SECOND
    
    // split into DATE form and HOUR form
    let splitTime = time.split(" ");

      ////////////////////////////////////////////
     //  DATE PART                             //
    ////////////////////////////////////////////

    // resultDate = YEAR-MONTH-DATEOFMONTH
    let resultDate = splitTime[0];

    // split DATE into YEAR, MONTH, and DATEOFMONTH
    let splitDate = resultDate.split("-");

    let resultYear = splitDate[0];
    let resultMonth = splitDate[1] - 1;
    let resultDateOfMonth = splitDate[2];

      ////////////////////////////////////////////
     //  HOUR PART                             //
    ////////////////////////////////////////////

    // resultHour = HOUR:MINUTE:SECOND
    let resultHour = splitTime[1];

    // split HOUR into HOUR, MINUTE, and SECOND
    let splitHour = resultHour.split(":");

    let resultHourC = splitHour[0];
    let resultMinute = splitHour[1];
    let resultSecond = splitHour[2];

      ////////////////////////////////////////////
     //  CONSTRUCT DATE PART                   //
    ////////////////////////////////////////////

    // now we get every component to construct date from String
    let newDate = new Date(
      resultYear,
      resultMonth,
      resultDateOfMonth,
      resultHourC,
      resultMinute,
      resultSecond,
      0
    );

    return newDate;
  }
}
