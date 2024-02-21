import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import Icono from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";

export default class Wapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banderaBuscador: true,
      city: "Guadalajara", 
      states: "Jalisco", 
      temperatura: "27",
      textoTemperatura: "Parcialmente",
      imagenTemp: "",
      viento: "23",
      precip: "12",
      sun: "18:05 AM",
      dailyForecast: [], 
      ciudad: "Guadalajara", 
    };
  }

  busca = () => {
    this.setState((prevState) => ({ banderaBuscador: !prevState.banderaBuscador }));

    axios.get(`http://api.weatherapi.com/v1/forecast.json?key=f780cdd126884856acc40541240102&q=${this.state.ciudad}&days=5&aqi=no&alerts=no&lang=es`)
      .then(response => {
        console.log(response.data);
        this.setState({
          temperatura: response.data.current.temp_c,
          textoTemperatura: response.data.current.condition.text,
          imagenTemp: response.data.current.condition.icon,
          viento: response.data.current.wind_kph,
          precip: response.data.current.precip_mm,
          sun: response.data.forecast.forecastday[0].astro.sunrise,
          city: response.data.location.name,
          states: response.data.location.region,
          dailyForecast: response.data.forecast.forecastday.slice(1) // Excluir el día actual
        });
      })
      .catch(error => { 
        console.log(error);
      });
  }

  // Función para obtener el nombre del día de la semana a partir de una fecha
  getDayOfWeek = (date) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[new Date(date).getDay()];
  }

  render() {
    return (
      <View>
        <ImageBackground source={require('./Imagenes/images/bg.png')} style={{ width: 400, height: 800 }} blurRadius={40} />
        <View
            style={{
                borderColor: "red",
                width: 300,
                height: 50,
                borderWidth: 0,
                marginTop: -750,
                marginLeft: 45,
                backgroundColor: this.state.banderaBuscador ? 'grey' : 'transparent',
                opacity: 0.7,
                borderRadius: 40,
            }}
        >
            <TextInput
              placeholder="Buscar Ciudad"
              onChangeText={ciudad => this.setState({ ciudad })}
              defaultValue={this.state.ciudad} // Establece un valor predeterminado
            />

        </View>
        <TouchableOpacity onPress={this.busca}>
            <View
                style={{
                    alignItems: 'center',
                    borderWidth: 0,
                    borderColor: "red",
                    width: 48,
                    height: 48,
                    borderRadius: 48,
                    backgroundColor: "gray",
                    opacity: 0.5,
                    marginTop: -49,
                    marginLeft: 297
                }}
            >
                <Icono name="magnify" size={45} color="white" />
            </View>
        </TouchableOpacity>
        <View>
            <Text
            style={{
                fontSize: 28,
                color: "white",
                marginTop: 40,
                marginLeft: 40,
            }}>{this.state.city} , </Text>
            <Text
            style = {{
                fontSize: 20,
                color: "gray",
                marginLeft: 220,
                marginTop: -28,
            }}>{this.state.states}</Text>
        </View>
        <View>
            <Image source = {this.state.imagenTemp==="" ? require("./Imagenes/images/partlycloudy.png") : {uri:'http:'+this.state.imagenTemp}}
            style={{
                width: 180,
                height: 180,
                marginTop: 30,
                marginLeft: 105,
                alignItems: 'center',
            }}
            />
        </View>
        <View>
            <Text style = {{fontSize:40, color: "white", fontWeight: 800, textAlign: 'center',}}>{this.state.temperatura}°</Text>
            <Text style = {{fontSize: 20, color: "white", opacity: 0.5, textAlign: "center"}}>{this.state.textoTemperatura}</Text>
        </View>
        <View>
            <Image source={require("./Imagenes/icons/wind.png")} style = {{
              width: 20,
              height: 20,  
              marginTop: 20,
              marginLeft: 15,
            }} />
            <Text style = {{
                color: "white",
                marginTop: -20,
                marginLeft: 50,
            }}>{this.state.viento} Km</Text>
        </View>
        <View style = {{
            marginTop: -40,
            marginLeft: 130,
        }}>
            <Image source={require("./Imagenes/icons/drop.png")} style = {{
              width: 20,
              height: 20,  
              marginTop: 20,
              marginLeft: 30,
            }} />
            <Text style = {{
                color: "white",
                marginTop: -20,
                marginLeft: 55,
                alignItems: 'center'
            }}>{this.state.precip} %</Text>
        </View>
        <View style = {{
            marginTop: -40,
            marginLeft: 250,
        }}>
            <Image source={require("./Imagenes/icons/sun.png")} style = {{
              width: 20,
              height: 20,  
              marginTop: 20,
              marginLeft: 10,
            }} />
            <Text style = {{
                color: "white",
                marginTop: -20,
                marginLeft: 40,
            }}>{this.state.sun}</Text>
        </View>
         <ScrollView horizontal={true}>
          {this.state.dailyForecast.map((day, index) => (
            <View key={index} style={{ padding: 15, alignItems: 'baseline' }}>
              <Text style={{ color: "white", marginTop: 25, marginLeft: 19}}>{this.getDayOfWeek(day.date)}</Text>
              <Image source={{ uri: "http:" + day.day.condition.icon }} style={{ width: 90, height: 90 }} />
              <Text style={{ color: "white", marginLeft: 19 }}>{day.day.maxtemp_c}°C</Text>
              <Text style={{ color: "white", marginLeft: 19 }}>{day.day.mintemp_c}°C</Text>
            </View>
          ))}
        </ScrollView>
         
      </View>
    );
  }
}



