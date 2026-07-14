import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function SquareButton({ label, onPress, filled = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SplashScreen({ onContinue }) {
  return (
    <View style={styles.centeredScreen}>
      <Text style={styles.logo}>TYNK</Text>
      <Text style={styles.smallLabel}>APP PLACEHOLDER</Text>
      <SquareButton label="CONTINUE" onPress={onContinue} filled />
    </View>
  );
}

function WelcomeScreen({ onSignIn, onCreateAccount, onExplore }) {
  return (
    <View style={styles.screen}>
      <View>
        <Text style={styles.eyebrow}>WELCOME TO</Text>
        <Text style={styles.heading}>TYNK</Text>
        <Text style={styles.bodyCopy}>
          A blank starting point for collecting, organizing, and returning to
          the things that matter to you.
        </Text>
      </View>

      <View style={styles.buttonStack}>
        <SquareButton label="CREATE ACCOUNT" onPress={onCreateAccount} filled />
        <SquareButton label="SIGN IN" onPress={onSignIn} />
        <SquareButton label="EXPLORE" onPress={onExplore} />
      </View>
    </View>
  );
}

function SignInScreen({ mode, onBack, onComplete }) {
  const creatingAccount = mode === 'create';

  return (
    <View style={styles.screen}>
      <View>
        <TouchableOpacity accessibilityRole="button" onPress={onBack}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>
          {creatingAccount ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </Text>

        {creatingAccount && (
          <TextInput
            autoCapitalize="words"
            placeholder="NAME"
            placeholderTextColor="#000000"
            style={styles.input}
          />
        )}

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="EMAIL"
          placeholderTextColor="#000000"
          style={styles.input}
        />

        <TextInput
          placeholder="PASSWORD"
          placeholderTextColor="#000000"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <SquareButton
        label={creatingAccount ? 'CREATE ACCOUNT' : 'SIGN IN'}
        onPress={onComplete}
        filled
      />
    </View>
  );
}

function HomeScreen({ onOpenDashboard, onSignOut, guestMode = false }) {
  return (
    <View style={styles.screen}>
      <View>
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>{guestMode ? 'EXPLORE MODE' : 'HOME'}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={onSignOut}>
            <Text style={styles.smallAction}>
              {guestMode ? 'EXIT EXPLORE' : 'SIGN OUT'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>HELLO.</Text>
        <Text style={styles.bodyCopy}>
          {guestMode
            ? 'Explore the sample app freely. Anything changed or added during this visit will not be saved.'
            : 'This is the basic app home screen. Nothing here is permanently styled yet.'}
        </Text>
      </View>

      <View style={styles.homeGrid}>
        <TouchableOpacity style={styles.placeholderCard} onPress={onOpenDashboard}>
          <Text style={styles.cardNumber}>01</Text>
          <Text style={styles.cardTitle}>PERSONAL DASHBOARD</Text>
          <Text style={styles.cardCopy}>Open your own organized space.</Text>
        </TouchableOpacity>

        <View style={styles.placeholderCard}>
          <Text style={styles.cardNumber}>02</Text>
          <Text style={styles.cardTitle}>PLACEHOLDER</Text>
          <Text style={styles.cardCopy}>Reserved for a future feature.</Text>
        </View>
      </View>
    </View>
  );
}

function DashboardScreen({ onBack }) {
  return (
    <View style={styles.screen}>
      <View>
        <TouchableOpacity accessibilityRole="button" onPress={onBack}>
          <Text style={styles.backText}>← HOME</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>PERSONAL DASHBOARD</Text>
        <Text style={styles.bodyCopy}>
          This screen will eventually become the user-controlled space for
          arranging content however they choose.
        </Text>
      </View>

      <View style={styles.dashboardBox}>
        <Text style={styles.cardTitle}>EMPTY CANVAS</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [authMode, setAuthMode] = useState('signin');
  const [guestMode, setGuestMode] = useState(false);

  const openAuth = (mode) => {
    setGuestMode(false);
    setAuthMode(mode);
    setScreen('auth');
  };

  const openExplore = () => {
    setGuestMode(true);
    setScreen('home');
  };

  const leaveApp = () => {
    setGuestMode(false);
    setScreen('welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {screen === 'splash' && (
        <SplashScreen onContinue={() => setScreen('welcome')} />
      )}

      {screen === 'welcome' && (
        <WelcomeScreen
          onCreateAccount={() => openAuth('create')}
          onSignIn={() => openAuth('signin')}
          onExplore={openExplore}
        />
      )}

      {screen === 'auth' && (
        <SignInScreen
          mode={authMode}
          onBack={() => setScreen('welcome')}
          onComplete={() => {
            setGuestMode(false);
            setScreen('home');
          }}
        />
      )}

      {screen === 'home' && (
        <HomeScreen
          guestMode={guestMode}
          onOpenDashboard={() => setScreen('dashboard')}
          onSignOut={leaveApp}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardScreen onBack={() => setScreen('home')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 28,
    backgroundColor: '#ffffff',
  },
  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#000000',
    marginBottom: 8,
  },
  smallLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#000000',
    marginBottom: 48,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#000000',
    marginBottom: 8,
  },
  heading: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 20,
  },
  bodyCopy: { maxWidth: 430, fontSize: 17, lineHeight: 25, color: '#000000' },
  buttonStack: { gap: 12 },
  button: {
    width: '100%',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  buttonFilled: { backgroundColor: '#000000' },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#000000',
  },
  buttonTextFilled: { color: '#ffffff' },
  backText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#000000',
    marginBottom: 36,
  },
  input: {
    width: '100%',
    minHeight: 56,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallAction: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#000000',
  },
  homeGrid: { gap: 12 },
  placeholderCard: {
    minHeight: 140,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 18,
    backgroundColor: '#ffffff',
  },
  cardNumber: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 26,
    color: '#000000',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#000000',
    marginBottom: 8,
  },
  cardCopy: { fontSize: 15, lineHeight: 21, color: '#000000' },
  dashboardBox: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
    borderRadius: 0,
    backgroundColor: '#ffffff',
  },
});