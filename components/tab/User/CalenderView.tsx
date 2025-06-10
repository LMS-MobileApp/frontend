import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalenderView = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const assignments: Record<string, { title: string }> = {
    '2025-04-10': { title: 'Assignment 01' },
    '2025-04-18': { title: 'Assignment 02' },
    '2025-04-25': { title: 'Project Milestone' },
  };

  const markedDates = Object.keys(assignments).reduce((acc: Record<string, any>, date) => {
    acc[date] = {
      marked: true,
      dotColor: 'red',
      selected: date === selectedDate,
      selectedColor: '#70d7c7',
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar View</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => {
          setSelectedDate(day.dateString);
        }}
        theme={{
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
        }}
      />
      {selectedDate && assignments[selectedDate] && (
        <View style={styles.assignmentContainer}>
          <Text style={styles.assignmentText}>
            📌 {assignments[selectedDate].title}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  assignmentContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
  },
  assignmentText: {
    fontSize: 16,
    color: '#007acc',
  },
});

export default CalenderView;
