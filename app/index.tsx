import { SafeAreaProvider } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import StartScreen from "@/components/StartScreen";
import Registration from "@/components/Registration";
import Login from "@/components/Login";
import AssignmentView from "@/components/tab/User/AssignmentView";
import Dashboard from "@/components/tab/User/Dashboard";
import Assignments from "@/components/tab/User/Assignments";
import UserProfileScreen from "@/components/tab/User/UserProfileScreen";
import SettingScreen from "@/components/SettingScreen";
import CalenderView from "@/components/tab/User/CalenderView";
import CollaborationHub from "@/components/tab/User/CollaborationHub";
import AdminDashboard from "@/components/tab/Lecture/AdminDashboard";
import AddAssignment from "@/components/tab/Lecture/AddAssignment";
import AllAssignments from "@/components/tab/Lecture/AllAssignments";
import EditAssignment from "@/components/tab/Lecture/EditAssignment";

const Stack = createStackNavigator();

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={StartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="AssignmentView" component={AssignmentView} options={{ headerShown: false }} />
        <Stack.Screen name="UserDashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="Assignments" component={Assignments} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalenderView" component={CalenderView} options={{ headerShown: false }} />
        <Stack.Screen name="CollaborationHub" component={CollaborationHub} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="AddAssignment" component={AddAssignment} options={{ headerShown: false }} />
        <Stack.Screen name="AllAssignments" component={AllAssignments} options={{ headerShown: false }} />
        <Stack.Screen name="EditAssignment" component={EditAssignment} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Toast />
    </SafeAreaProvider>
  );
}