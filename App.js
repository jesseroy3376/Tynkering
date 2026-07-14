import React, { useState } from 'react';
import {
  Modal,
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
    <TouchableOpacity onPress={onPress} style={[styles.button, filled && styles.buttonFilled]}>
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ConfirmationPopup({ visible, title, message, primaryLabel, secondaryLabel, onPrimary, onSecondary }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalCopy}>{message}</Text>
          <View style={styles.stack}>
            <SquareButton label={primaryLabel} onPress={onPrimary} filled />
            <SquareButton label={secondaryLabel} onPress={onSecondary} />
          </View>
        </View>
      </View>
    </Modal>
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
        <Text style={styles.bodyCopy}>A blank starting point for collecting, organizing, and returning to the things that matter to you.</Text>
      </View>
      <View style={styles.stack}>
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
        <TouchableOpacity onPress={onBack}><Text style={styles.backText}>← BACK</Text></TouchableOpacity>
        <Text style={styles.heading}>{creatingAccount ? 'CREATE ACCOUNT' : 'SIGN IN'}</Text>
        {creatingAccount && <TextInput placeholder="NAME" placeholderTextColor="#000" style={styles.input} />}
        <TextInput placeholder="EMAIL" placeholderTextColor="#000" keyboardType="email-address" style={styles.input} />
        <TextInput placeholder="PASSWORD" placeholderTextColor="#000" secureTextEntry style={styles.input} />
      </View>
      <SquareButton label={creatingAccount ? 'CREATE ACCOUNT' : 'SIGN IN'} onPress={onComplete} filled />
    </View>
  );
}

function AppShell({ title, guestMode, onLeave, children }) {
  return (
    <View style={styles.shellScreen}>
      <View style={styles.shell}>
        <View style={styles.shellRow}>
          <TouchableOpacity><Text style={styles.shellButton}>PROFILE</Text></TouchableOpacity>
          <Text style={styles.shellTitle}>{title}</Text>
          <TouchableOpacity><Text style={[styles.shellButton, styles.shellButtonRight]}>SETTINGS</Text></TouchableOpacity>
        </View>
        <View style={styles.utilityRow}>
          <Text style={styles.utilityText}>{guestMode ? 'EXPLORE MODE' : ''}</Text>
          <TouchableOpacity onPress={onLeave}><Text style={styles.utilityText}>{guestMode ? 'EXIT EXPLORE' : 'SIGN OUT'}</Text></TouchableOpacity>
        </View>
      </View>
      {children}
    </View>
  );
}

function FeatureButton({ title, copy }) {
  return (
    <TouchableOpacity style={styles.featureButton}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureCopy}>{copy}</Text>
    </TouchableOpacity>
  );
}

function HomeScreen({ onSignOut, guestMode }) {
  return (
    <AppShell title="HOME" guestMode={guestMode} onLeave={onSignOut}>
      <View style={styles.homeContent}>
        <Text style={styles.homeLogo}>TYNK</Text>
        <View style={styles.featureGrid}>
          <FeatureButton title="MIND LOUNGE" copy="Your personalized shortcut space." />
          <FeatureButton title="CATCH A THOUGHT" copy="Quickly capture something new." />
          <FeatureButton title="WORKSPACE" copy="Build and develop your content." />
          <FeatureButton title="OVERVIEW" copy="Browse and organize everything." />
        </View>
      </View>
    </AppShell>
  );
}

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [authMode, setAuthMode] = useState('signin');
  const [guestMode, setGuestMode] = useState(false);
  const [showRememberPopup, setShowRememberPopup] = useState(false);
  const [showExplorePopup, setShowExplorePopup] = useState(false);

  const openAuth = (mode) => {
    setGuestMode(false);
    setAuthMode(mode);
    setScreen('auth');
  };

  const enterSignedInApp = () => {
    setShowRememberPopup(false);
    setScreen('home');
  };

  const confirmExplore = () => {
    setShowExplorePopup(false);
    setGuestMode(true);
    setScreen('home');
  };

  const leaveApp = () => {
    setGuestMode(false);
    setScreen('welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {screen === 'splash' && <SplashScreen onContinue={() => setScreen('welcome')} />}
      {screen === 'welcome' && (
        <WelcomeScreen
          onCreateAccount={() => openAuth('create')}
          onSignIn={() => openAuth('signin')}
          onExplore={() => setShowExplorePopup(true)}
        />
      )}
      {screen === 'auth' && (
        <SignInScreen
          mode={authMode}
          onBack={() => setScreen('welcome')}
          onComplete={() => setShowRememberPopup(true)}
        />
      )}
      {screen === 'home' && <HomeScreen guestMode={guestMode} onSignOut={leaveApp} />}

      <ConfirmationPopup
        visible={showRememberPopup}
        title="REMEMBER THIS ACCOUNT?"
        message="Would you like Tynk to remember this account on this device for faster sign-in next time?"
        primaryLabel="REMEMBER ACCOUNT"
        secondaryLabel="NOT NOW"
        onPrimary={enterSignedInApp}
        onSecondary={enterSignedInApp}
      />
      <ConfirmationPopup
        visible={showExplorePopup}
        title="EXPLORE TYNK"
        message="Feel free to explore the app without any setup. This is an unguided app demo. You can add or change content while exploring, but your progress cannot be saved and will be lost when you exit. Would you like to continue?"
        primaryLabel="YES"
        secondaryLabel="NO"
        onPrimary={confirmExplore}
        onSecondary={() => setShowExplorePopup(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  screen: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 42, paddingBottom: 28, backgroundColor: '#fff' },
  centeredScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 64, fontWeight: '900', letterSpacing: 8, color: '#000', marginBottom: 8 },
  smallLabel: { fontSize: 12, letterSpacing: 2, color: '#000', marginBottom: 48 },
  eyebrow: { fontSize: 13, fontWeight: '700', letterSpacing: 2, color: '#000', marginBottom: 8 },
  heading: { fontSize: 40, lineHeight: 44, fontWeight: '900', color: '#000', marginBottom: 20 },
  bodyCopy: { fontSize: 17, lineHeight: 25, color: '#000' },
  stack: { gap: 12 },
  button: { width: '100%', minHeight: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#000', backgroundColor: '#fff', paddingHorizontal: 16 },
  buttonFilled: { backgroundColor: '#000' },
  buttonText: { fontSize: 15, fontWeight: '800', letterSpacing: 1.5, color: '#000' },
  buttonTextFilled: { color: '#fff' },
  backText: { fontSize: 14, fontWeight: '800', letterSpacing: 1.5, color: '#000', marginBottom: 36 },
  input: { width: '100%', minHeight: 56, borderWidth: 2, borderColor: '#000', paddingHorizontal: 14, marginBottom: 14, fontSize: 16, color: '#000', backgroundColor: '#fff' },
  shellScreen: { flex: 1, padding: 24, backgroundColor: '#fff' },
  shell: { borderWidth: 2, borderColor: '#000', padding: 16 },
  shellRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shellButton: { width: 88, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: '#000' },
  shellButtonRight: { textAlign: 'right' },
  shellTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 2, color: '#000' },
  utilityRow: { minHeight: 16, marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  utilityText: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#000' },
  homeContent: { flex: 1, justifyContent: 'center' },
  homeLogo: { fontSize: 48, fontWeight: '900', letterSpacing: 7, textAlign: 'center', color: '#000', marginBottom: 34 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureButton: { width: '48%', aspectRatio: 1, borderWidth: 2, borderColor: '#000', padding: 16, justifyContent: 'flex-end', backgroundColor: '#fff' },
  featureTitle: { fontSize: 17, lineHeight: 21, fontWeight: '900', letterSpacing: 0.7, color: '#000', marginBottom: 8 },
  featureCopy: { fontSize: 13, lineHeight: 18, color: '#000' },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: { width: '100%', maxWidth: 430, borderWidth: 2, borderColor: '#000', backgroundColor: '#fff', padding: 24 },
  modalTitle: { fontSize: 26, lineHeight: 31, fontWeight: '900', color: '#000', marginBottom: 14 },
  modalCopy: { fontSize: 17, lineHeight: 25, color: '#000', marginBottom: 24 },
});
