import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import React from "react";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "ae9263b9a937aa40633d7132f6619db2";

export default class extends React.Component {
  state = {
    isLoading: true,
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather,
        name,
      },
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
      name,
    });
  };
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };
  reload = async () => {
    try {
      Alert.alert("새로고침 합니다.");
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  }
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition, name } = this.state;
    const reload = this.reload
    return isLoading ? (
      <>
        <Loading />
        <StatusBar style="auto" />
      </>
    ) : (
      <>
        <Weather temp={Math.round(temp)} condition={condition} name={name} reload={reload} />
        <StatusBar style="auto" />
      </>
    );
  }
}
