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
    return {
      'Year': resultYear,
      'Month': resultMonth,
      'DateOfMonth': resultDateOfMonth,
      'Hour': resultHourC,
      'Minute': resultMinute,
      'Second': resultSecond
    };
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
    return new Date(
        resultYear,
        resultMonth,
        resultDateOfMonth,
        resultHourC,
        resultMinute,
        resultSecond,
        0
    );
  }

  /**
   * This function is to convert base64 string to image
   * and return the string which can be display using
   * [src].
   * 
   * @param base64 String of base64 image without data types
   * 
   * @returns String of ready image to display with [img]="put-here-value"
   * 
   * @example "data:image/jpeg;base64, =/91dsadNJNDSJA .... SANDSKA/=="
   */
  public static convertBase64ToImage (base64: string) {
    let addOn = "data:image/jpeg;base64,";
    return addOn + base64;
  }

  /**
   * Convert from date string, usually from API, in form
   * YEAR-MONTH-DATE HOUR:MINUTE:SECOND into HOUR:MINUTE, it
   * will return new string
   * 
   * @param dateString Date in string format (YEAR-MONTH-DATE HOUR:MINUTE:SECOND)
   * 
   * @returns New time in string format (HOUR:MINUTE)
   * 
   * @example "23:59"
   */
  public static convertDateStringToHourMinuteOnly (dateString: string) {

    let dateStringSplit = dateString.split(" ");
    let getHour = dateStringSplit[1];

    let hourSplit = getHour.split(":");
    return hourSplit[0] + ":" + hourSplit[1];
  }

  /**
   * Convert from Date class object into Date in string with API
   * format (YEAR-MONTH-DATE HOUR:MINUTE:SECOND), it will return
   * string.
   * 
   * @param date Date object
   * 
   * @returns Date in string format (YEAR-MONTH-DATE HOUR:MINUTE:SECOND)
   * 
   * @example "2019-11-23 21:30:46"
   */
  public static convertDateToApiTimeFormat (date: Date) {

    let year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    if (month < 10){
      let lastMonth = month;
      month = "0" + lastMonth;
    }
    else
      month = date.getMonth() + 1;

    let dateOfMonth: any = date.getDate();
    if (dateOfMonth < 10)
      dateOfMonth = "0" + date.getDate();
    else
      dateOfMonth = date.getDate();
    
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return year + "-" + month + "-" + dateOfMonth + " " + hour + ":" + minute + ":" + second;
  }
}
