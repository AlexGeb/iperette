import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { momentObj } from 'react-moment-proptypes';
import Month from './Month';
import { range } from './utils';

const propTypes = {
  year: PropTypes.number.isRequired,
  forceFullWeeks: PropTypes.bool,
  showDaysOfWeek: PropTypes.bool,
  showWeekSeparators: PropTypes.bool,
  firstDayOfWeek: PropTypes.number,
  selectRange: PropTypes.bool,
  onPickDate: PropTypes.func,
  onPickRange: PropTypes.func,
  selectedDay: momentObj,
  customClasses: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

const defaultProps = {
  forceFullWeeks: false,
  showDaysOfWeek: true,
  showWeekSeparators: true,
  firstDayOfWeek: 0,
  selectRange: false,
  onPickDate: null,
  onPickRange: null,
  selectedDay: moment(),
  customClasses: null
};

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectingRange: undefined
    };
  }

  dayClicked(date, classes, dayElement) {
    if (!date) {
      // clicked on prev or next month
      return;
    }

    let { selectingRange } = this.state;
    const { selectRange, onPickRange, onPickDate } = this.props;

    if (!selectRange) {
      if (onPickDate instanceof Function) {
        onPickDate(date, classes, dayElement);
      }
      return;
    }

    if (!selectingRange) {
      selectingRange = [date, date];
    } else {
      if (onPickRange instanceof Function) {
        if (selectingRange[0] > date) {
          onPickRange(date, selectingRange[0]);
        } else {
          onPickRange(selectingRange[0], date);
        }
      }
      selectingRange = undefined;
    }

    this.setState({
      selectingRange
    });
  }

  dayHovered(hoveredDay, classes, dayElement) {
    if (!hoveredDay) {
      // clicked on prev or next month
      return;
    }

    const { selectingRange } = this.state;
    const { onHoveredDate } = this.props;

    if (!selectingRange) {
      if (onHoveredDate instanceof Function) {
        onHoveredDate(hoveredDay, classes, dayElement);
      }
      return;
    }

    selectingRange[1] = hoveredDay;

    this.setState({
      selectingRange
    });
  }

  renderDaysOfWeek() {
    const { firstDayOfWeek, forceFullWeeks, showWeekSeparators } = this.props;
    const totalDays = forceFullWeeks ? 42 : 37;

    const days = [];
    range(firstDayOfWeek, totalDays + firstDayOfWeek).forEach(i => {
      const day = moment()
        .weekday(i)
        .format('dd')
        .charAt(0);

      if (showWeekSeparators) {
        if (i % 7 === firstDayOfWeek && days.length) {
          // push week separator
          days.push(<th className="week-separator" key={`seperator-${i}`} />);
        }
      }
      days.push(
        <th key={`weekday-${i}`} className={i % 7 === 0 ? 'bolder' : ''}>
          {day}
        </th>
      );
    });

    return (
      <tr>
        <th>&nbsp;</th>
        {days}
      </tr>
    );
  }

  render() {
    const { selectingRange } = this.state;

    const months = range(0, 12).map(month => (
      <Month
        month={month}
        key={`month-${month}`}
        dayClicked={(d, classes, dayElement) =>
          this.dayClicked(d, classes, dayElement)
        }
        dayHovered={(d, classes, dayElement) =>
          this.dayHovered(d, classes, dayElement)
        }
        {...this.props}
        selectingRange={selectingRange}
      />
    ));

    return (
      <table className="calendar">
        <thead className="day-headers">
          {this.props.showDaysOfWeek ? this.renderDaysOfWeek() : null}
        </thead>
        <tbody>{months}</tbody>
      </table>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

export default Calendar;
