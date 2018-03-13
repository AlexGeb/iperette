import React, { Component } from 'react';
import { Calendar as Cal, CalendarControls } from 'react-yearly-calendar';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment/locale/fr';
import './calendrier.css';
import { Bookings } from '../../../api/bookings';

class Calendrier extends Component {
  constructor() {
    super();
    moment().locale('fr');
    const today = moment();
    this.state = {
      year: today.year(),
      selectedDay: today
    };
  }
  onNextYear = () => {
    const { year } = this.state;
    this.setState({ year: year + 1 });
  };
  onPrevYear = () => {
    const { year } = this.state;
    this.setState({ year: year - 1 });
  };
  goToToday = () => {
    const today = moment();
    this.setState({
      selectedDay: today,
      year: today.year()
    });
  };
  renderStyles = () => {
    let styles = ``;
    let customClasses = {};
    this.props.bookings.forEach(b => {
      const className = `booking-${b._id}`;
      styles += `table.calendar td.${className} {
        background:${b.color};
      } 
      `;
      customClasses[className] = { start: b.start, end: b.end };
    });
    return { styles, customClasses };
  };
  onDayClicked = (day, classes) => {
    if (classes && classes.indexOf('booking') !== -1) {
      console.log('booking clicked', day, classes);
      console.log(this.getBookingFromDate(day));
    }
  };

  getBookingFromDate = date => {
    return this.props.bookings.find(b =>
      date.isBetween(b.start, b.end, null, '[]')
    );
  };

  render() {
    const { year, selectedDay } = this.state;
    const { styles, customClasses } = this.renderStyles();
    console.log('re-rendering calendrier', this.props.bookings);
    return (
      <div id="calendar">
        <style>{styles}</style>
        <CalendarControls
          year={year}
          onPrevYear={this.onPrevYear}
          onNextYear={this.onNextYear}
          showTodayButton={true}
          goToToday={this.goToToday}
        />
        <Cal
          year={year}
          forceFullWeeks={true}
          firstDayOfWeek={0}
          selectedDay={selectedDay}
          showWeekSeparators={true}
          customClasses={customClasses}
          onPickDate={this.onDayClicked}
        />
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('bookings');
  return {
    bookings: Bookings.find({}, { sort: { createdAt: -1 } }).fetch()
  };
})(Calendrier);
