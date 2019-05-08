func saveTimetableData(r *http.Request, tQid string) ([]models.StudentLessonDay, error) {

	if tQid == "" {
		return nil, errors.New("Invalid Teacher Qid");
	}

	var err error
	s := []models.StudentLessonDay{}

	// Get Json Data from new events array
	jsonTextDataTimetable := r.FormValue("timetable")
	if jsonTextDataTimetable == "" {
		return s, errors.New("Invalid data provided with request")
	}

	// Get Json Data from backup array
	jsonTextDataBackupTimetable := r.FormValue("timetable-backup")
	if jsonTextDataBackupTimetable == "" {
		return s, errors.New("Invalid data provided with request")
	}

	var timetableEvents = make([]models.StudentLessonDay, 0)
	var timetableEventsBackup = make([]models.StudentLessonDay, 0)

	err = json.Unmarshal([]byte(jsonTextDataTimetable), &timetableEvents)
	if err != nil {
		return s, err
	}

	err = json.Unmarshal([]byte(jsonTextDataBackupTimetable), &timetableEventsBackup)
	if err != nil {
		return s, err
	}


	/*

	Comparing timetable backup array and timetable new array gives us 3 types of events:

	- Newly created by user
	- Previously existing events which are updated
	- Deleted events by user

	 */

	var toBeAdded []models.StudentLessonDay

	//add events which are newly generated to array
	for k, v := range timetableEvents {

		//Find if event currently exists in database
		if !models.StudentLessonDays().Filter("teacher_qid", tQid).Filter("id",v.Id).Exist() {
			toBeAdded = append(toBeAdded, timetableEvents[k])
		}
	}

	//Compare arrays and find updated events
	for k, vBackup := range timetableEventsBackup {

		found := false
		for _, vNew := range timetableEvents {

			//Find common rows by matching Id between Backup array and New array
			if vBackup.Id == vNew.Id {
				sld := models.StudentLessonDay{
					Id: vNew.Id,
				}

				//Check if any data is changed
				if vBackup.LessonDay !=  vNew.LessonDay || vBackup.LessonTime != vNew.LessonTime || vBackup.ClassName != vNew.ClassName || vBackup.Duration != vNew.Duration || vBackup.LocationId != vNew.LocationId {

					//Update data
					sld.LessonDay = vNew.LessonDay
					sld.LessonTime = vNew.LessonTime
					sld.ClassName = vNew.ClassName
					sld.Duration = vNew.Duration
					sld.LocationId = vNew.LocationId
					sld.Updated = time.Now()
					err = sld.Update("lesson_day","lesson_time","duration","class_name","updated","location_id")

					if err!= nil {
						fmt.Println(err)
						return s, err
					}
				}
				found = true
				break;
			}

		}

		//If element exists in backup array but doesn't exist in new array, means it is deleted by user.
		if found == false {
			err = timetableEventsBackup[k].Delete()
			if err != nil {
				fmt.Println(err)
				return s, err
			}
		}
	}

	//Add necessary rows to table
	rowNum := len(toBeAdded)
	row := make([]models.StudentLessonDay, rowNum)

	for k, v := range toBeAdded {
		row[k].TeacherQid = tQid
		row[k].StudentId = v.StudentId
		row[k].Updated = time.Now()
		row[k].Duration = v.Duration
		row[k].ClassName = v.ClassName
		row[k].LessonDay = v.LessonDay
		row[k].LessonTime = v.LessonTime
		row[k].LocationId = v.LocationId
		err = row[k].Insert()
	}

	if err != nil {
		return s, err
	}

	return s, nil
}


func postWeeklyEvents(teacher models.User, formData *http.Request) (error) {
	var err error

	// Get Json Data
	jsonTextData := formData.FormValue("weekly-schedules")
	if jsonTextData == "" {
		return errors.New("Invalid data provided with request")
	}

	// Get Week check
	weekCheck := formData.Form["week-check[]"]
	fromDay, err := time.Parse("2006/01/02", formData.FormValue("from-day"))
	untilDay, err := time.Parse("2006/01/02", formData.FormValue("until-day"))

	// Get timetable data from timetable.js
	var textData = make([]models.StudentLessonDatetime, 0)
	err = json.Unmarshal([]byte(jsonTextData), &textData)

	if err != nil {
		fmt.Println(err)
		return err
	}

	var wg sync.WaitGroup

	// Iterate each event from student lesson day table
	for k, v := range textData {

		wg.Add(1)
		go func(v models.StudentLessonDatetime, k int) {
			defer wg.Done() // defer will called after below processing
			attendeeQid := v.Attendee
			lessonDayId := v.Id
			className := v.ClassName
			locationId := int64(v.LocationId)

			var repeatId string

			// Generate until repeatId is unique
			for {
				repeatId = randSerialGenerator(16, int64(k))
				if !models.Calendars().Filter("event_repeat_id", repeatId).Exist() {
					break
				}
			}


			start, _ := time.Parse("2006-01-02T15:04:00+09:00", v.Start)
			end, _ := time.Parse("2006-01-02T15:04:00+09:00", v.End)

			//Get all existing calendar rows for the respective event between 'from' and 'until' dates and order in ascending order of start date
			var toBeUpdatedRows []models.Calendar
			_, err = models.Calendars().Filter("owner", teacher.Qid).Filter("has_lesson_day", true).Filter("dt_start__gte", fromDay).Filter("dt_end__lte", untilDay).Filter("lesson_day_id", v.Id).OrderBy("dt_start").All(&toBeUpdatedRows)

			if err != nil && err!= orm.ErrNoRows {
				fmt.Println(err.Error())
				return
			}

			/*--------
			This code will proceed by evaluating one week at a time.
			Between 'from' and 'untilDay', take one week and check it with respect to start date of toBeUpdatedRows
			 --------*/

			// Can be an infinite loop but just as a restriction, i<200
			newEvents := make([]models.Calendar, 200)

			// j is a counter to iterate toBeUpdatedRows
			j := 0

			// Loop all the events
			for i := 0; i < len(newEvents);i++ {

				// Calculate start and end dates according to weekly events count
				newStartDate := start.AddDate(0, 0, 7 * i)
				newEndDate := end.AddDate(0, 0, 7 * i)

				// Value is out of scope but continue with loop
				if newStartDate.Before(fromDay){
					continue;
				}

				// Keep adding 1 week to 'fromDay' until it finds a row with 'dt_start' BEFORE itself.
				// Add (i+1) because consider in case of first week contains calendar event, we need to check if event exists BEFORE fromDay
				if len(toBeUpdatedRows) > 0 && j < len(toBeUpdatedRows) && toBeUpdatedRows[j].DtStart.Before(fromDay.AddDate(0, 0, 7 * (i + 1))) {

					if isTargetWeek(newStartDate, weekCheck) {

						// If database has a date after 'untilDay', exit loop as it is out of scope
						if newStartDate.After(untilDay) {

							// Delete the rows where the dates are out scope of 'from' and 'until'
							err = toBeUpdatedRows[j].Delete()

							if err != nil {
								fmt.Println(err.Error())
								return
							}

							// Condition to iterate last week
							break;

						} else {
							// Update the existing rows to new values
							toBeUpdatedRows[j].ClassName = className
							toBeUpdatedRows[j].DtStart = newStartDate
							toBeUpdatedRows[j].DtEnd = newEndDate
							toBeUpdatedRows[j].EventRepeatId = repeatId
							toBeUpdatedRows[j].LocationId = locationId
							toBeUpdatedRows[j].LastModified = time.Now()
							err = toBeUpdatedRows[j].Update("dt_start", "dt_end", "class_name", "event_repeat_id", "last_modified", "location_id")

							if err != nil {
								fmt.Println(err.Error())
								return
							}
						}

					// Delete the events in the week not selected by user
					} else {

						// Target not found and new date is after untilDay
						if newStartDate.After(untilDay) {
							break;
						}

						// Delete existing events
						err = toBeUpdatedRows[j].Delete()

						if err != nil {
							fmt.Println(err.Error())
							return
						}
					}

				// next row
				j++

				} else {

					// Data out of scope so exit loop
					if newStartDate.After(untilDay){
						break;
					}

					// Generate new events
					if isTargetWeek(newStartDate, weekCheck) {
						newEvents[i].Owner = teacher.Qid
						newEvents[i].DtStart = newStartDate
						newEvents[i].DtEnd = end.AddDate(0, 0, 7 * i)
						newEvents[i].ClassName = className
						newEvents[i].EventRepeatId = repeatId
						newEvents[i].LocationId = int64(locationId)
						newEvents[i].HasLessonDay = true
						newEvents[i].LessonDayId = int64(lessonDayId)
						newEvents[i].LastModified = time.Now()

						err = newEvents[i].Insert()

						if err != nil {
							fmt.Println(err.Error())
							fmt.Println(fmt.Sprintf("Insert error occurred : %d , event start day = %s, event end date = %s, calendar attendee = %d", teacher.Id, newStartDate.String(), end.AddDate(0, 0, 7 * i).String(), newEvents[i].Id))
						}

						// Add attendants (async)
						attendant := models.CalendarAttendee{
							Event:       newEvents[i].Id,
							AttendeeQid: attendeeQid,
							Category:    1,
						}
						go insertAsyncAttendant(attendant)
					}
				}
			}
		}(v, k)
	}


	// Delete events between 'from' and 'until' from calendar for which student lesson id doesn't exist
	var allCalendarEvents []models.Calendar
	_, err = models.Calendars().Filter("owner", teacher.Qid).GroupBy("lesson_day_id").Filter("has_lesson_day", true).Filter("dt_start__gte", fromDay).Filter("dt_end__lte", untilDay).All(&allCalendarEvents)

	if err != nil && err != orm.ErrNoRows {
		fmt.Println(err.Error())
		fmt.Println("No calendar event present")
		return err
	}

	for _,v := range allCalendarEvents {
		if !models.StudentLessonDays().Filter("teacher_qid", teacher.Qid).Filter("id", v.LessonDayId).Exist() {
			_ , err = models.Calendars().Filter("owner", teacher.Qid).Filter("dt_start__gte", fromDay).Filter("dt_end__lte", untilDay).Filter("lesson_day_id", v.LessonDayId).Delete()
		}

		if err != nil {
			fmt.Println(err.Error())
			return err
		}
	}

	wg.Wait()
	return nil
}