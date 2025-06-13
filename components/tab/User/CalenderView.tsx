import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getAllAssignmentCalendar } from '../../../utils/assignmentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalenderView = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await getAllAssignmentCalendar();
        console.log('API Response:', response);

        if (!Array.isArray(response) || response.length === 0) {
          console.log('No assignments received');
          setAssignments({});
          return;
        }

        const assignmentData = response.reduce((acc, item) => {
          const dateStr = item.date;
          if (dateStr) {
            acc[dateStr] = {
              ...acc[dateStr],
              [item._id]: {
                title: item.title,
                time: item.time,
                status: item.submitted ? 'completed' : item.status,
              },
            };
          }
          return acc;
        }, {});

        console.log('Processed Assignments:', assignmentData);
        setAssignments(assignmentData);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(`Failed to load: ${err.message}`);
        setAssignments({});
        Alert.alert('Error', `Failed to load: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const markedDates = Object.keys(assignments).reduce((acc, date) => {
    const assignmentsOnDate = assignments[date];
    const hasPending = Object.values(assignmentsOnDate).some(a => a.status === 'pending');
    const hasCompleted = Object.values(assignmentsOnDate).some(a => a.status === 'completed');

    acc[date] = {
      marked: true,
      dotColor: hasPending ? 'red' : hasCompleted ? 'green' : 'gray',
      selected: date === selectedDate,
      selectedColor: '#70d7c7',
    };
    return acc;
  }, {});

  const getAssignmentsForDate = (date) => assignments[date] || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignment Calendar</Text>
      {loading ? (
        <Text style={styles.message}>Loading...</Text>
      ) : (
        <>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              todayTextColor: '#00adf5',
              arrowColor: '#00adf5',
              dotColor: 'blue',
              selectedDotColor: 'white',
            }}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          {Object.keys(assignments).length === 0 && !error && (
            <Text style={styles.message}>No assignments found.</Text>
          )}
          {selectedDate && Object.keys(getAssignmentsForDate(selectedDate)).length > 0 && (
            <View style={styles.assignmentContainer}>
              {Object.values(getAssignmentsForDate(selectedDate)).map((assignment, index) => (
                <View key={index} style={styles.assignmentItem}>
                  <Text style={styles.assignmentText}>
                    📅 {assignment.title} {assignment.time && `(${assignment.time})`}
                  </Text>
                  <Text style={[styles.statusText, { color: assignment.status === 'completed' ? 'green' : 'red' }]}>
                    Status: {assignment.status}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 50, padding: 16, flex: 1 },
  title: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  assignmentContainer: { marginTop: 20, padding: 10, backgroundColor: '#e6f7ff', borderRadius: 8 },
  assignmentItem: { marginVertical: 5 },
  assignmentText: { fontSize: 16, color: '#007acc' },
  statusText: { fontSize: 14, fontStyle: 'italic' },
  message: { fontSize: 16, textAlign: 'center', marginTop: 20 },
  error: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'red' },
});

export default CalenderView;