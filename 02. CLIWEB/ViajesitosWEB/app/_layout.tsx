import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#eaf6f6' },
        headerTintColor: '#35798e',
        drawerStyle: { backgroundColor: '#f0f4f8' },
      }}
    >
      {/* PANTALLAS OCULTAS DEL DRAWER */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="LoginView"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="RegisterView"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      
      {/* OCULTAR COMPONENTES */}
      <Drawer.Screen
        name="components/VueloItem"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="components/CarritoModal"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="components/FlightMapModal"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="components/TablaAmortizacion"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="components/FormularioBusqueda"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="components/WeatherTimezoneInfo"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="styles/FlightMapModalStyles"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="styles/FacturaStyles"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="components/SelectorAsientos"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false
        }}
      />

      
      {/* PANTALLAS VISIBLES EN EL DRAWER */}
      <Drawer.Screen name="views/MenuView" options={{ title: 'Menú Principal' }} />
      <Drawer.Screen name="views/MisBoletosView" options={{ title: 'Mis Boletos' }} />
      <Drawer.Screen name="views/VuelosDisponiblesView" options={{ title: 'Vuelos Disponibles' }} />
      <Drawer.Screen name="views/ComprarBoletoView" options={{ title: 'Comprar Boletos' }} />
      <Drawer.Screen name="views/FacturasView" options={{ title: 'Mis Facturas' }} />
    </Drawer>
  );
}