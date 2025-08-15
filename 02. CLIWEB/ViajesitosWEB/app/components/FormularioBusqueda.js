// components/FormularioBusqueda.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { styles } from '../styles/FormularioBusquedaStyles';

export default function FormularioBusqueda({
  ciudades,
  origen,
  setOrigen,
  destino,
  setDestino,
  fecha,
  setFecha,
  onBuscar
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const renderCiudadItem = (item, onSelect, selected) => (
    <TouchableOpacity
      key={item.codigoCiudad}
      style={[
        isDesktop ? styles.ciudadBtnDesktop : styles.ciudadBtn,
        selected === item.codigoCiudad && styles.ciudadBtnSelected
      ]}
      onPress={() => onSelect(item.codigoCiudad)}
    >
      <Text style={[
        styles.ciudadText,
        selected === item.codigoCiudad && styles.ciudadTextSelected
      ]}>
        {item.codigoCiudad} - {item.nombreCiudad}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.formContainer,
      isDesktop && styles.formContainerDesktop
    ]}>
      <Text style={styles.header}>✈️ Buscar Vuelos</Text>

      <View style={[
        styles.formRow,
        isDesktop && styles.formRowDesktop
      ]}>
        {/* Ciudad de Origen */}
        <View style={[
          styles.formGroup,
          isDesktop && styles.formGroupDesktop
        ]}>
          <Text style={styles.subheader}>🛫 Ciudad de Origen</Text>
          {isDesktop ? (
            <View style={styles.ciudadGrid}>
              {ciudades.filter(c => c.codigoCiudad !== destino).map(c => 
                renderCiudadItem(c, setOrigen, origen)
              )}
            </View>
          ) : (
            <ScrollView horizontal contentContainerStyle={styles.selectorContainer}>
              {ciudades.filter(c => c.codigoCiudad !== destino).map(c => 
                renderCiudadItem(c, setOrigen, origen)
              )}
            </ScrollView>
          )}
        </View>

        {/* Ciudad de Destino */}
        <View style={[
          styles.formGroup,
          isDesktop && styles.formGroupDesktop
        ]}>
          <Text style={styles.subheader}>🛬 Ciudad de Destino</Text>
          {isDesktop ? (
            <View style={styles.ciudadGrid}>
              {ciudades.filter(c => c.codigoCiudad !== origen).map(c => 
                renderCiudadItem(c, setDestino, destino)
              )}
            </View>
          ) : (
            <ScrollView horizontal contentContainerStyle={styles.selectorContainer}>
              {ciudades.filter(c => c.codigoCiudad !== origen).map(c => 
                renderCiudadItem(c, setDestino, destino)
              )}
            </ScrollView>
          )}
        </View>
      </View>

      {/* Fecha de Vuelo */}
      <View style={[
        styles.formGroup,
        isDesktop && styles.formGroupCentered
      ]}>
        <Text style={styles.subheader}>📅 Fecha de Vuelo</Text>
        <TextInput
          style={[
            styles.input,
            isDesktop && styles.inputDesktop
          ]}
          placeholder="YYYY-MM-DD"
          value={fecha}
          onChangeText={setFecha}
        />
      </View>

      {/* Botón Buscar */}
      <TouchableOpacity 
        style={[
          styles.btnBuscar,
          isDesktop && styles.btnBuscarDesktop
        ]} 
        onPress={onBuscar}
      >
        <Text style={styles.btnText}>🔍 Buscar Vuelos</Text>
      </TouchableOpacity>
    </View>
  );
}