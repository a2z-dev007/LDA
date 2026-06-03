import React, { useState, useRef, useEffect } from 'react';
import { DayHeader } from '../../components/common/DayHeader';
import {
  View, Text, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Animated, Keyboard, TouchableOpacity,
  Image, PermissionsAndroid, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { haptics } from '../../utils/haptics';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { Edit2, Camera, Target, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CommonJar, CommonJarHandle } from '../../components/common/CommonJar';
import { CustomBottomSheet } from '../../components/common/CustomBottomSheet';
import { GradientButton } from '../../components/common/GradientButton';

type Nav = StackNavigationProp<RootStackParamList, 'Day4MemoryJar'>;

const PRESET_EMOJIS = ['❤️', '✈️', '🏡', '🎓', '🏖️', '🍽️', '👩‍❤️‍👨', '🎉'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const Day4MemoryJar: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const setDay4Memory = useDayStore((s) => s.setDay4Memory);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const setJarFillLevel = useJournalStore((s) => s.setJarFillLevel);

  // CommonJar Reference
  const jarRef = useRef<CommonJarHandle>(null);

  // States
  const [activeTab, setActiveTab] = useState<'text' | 'photo' | 'emoji'>('text');
  const [memoryText, setMemoryText] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoSourceSheetVisible, setPhotoSourceSheetVisible] = useState(false);
  
  // Date/Emoji tab states (Calendar Picker)
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [activeMonth, setActiveMonth] = useState(4); // May (0-indexed)
  const [activeYear, setActiveYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(30);
  const [dateText, setDateText] = useState('30 May 2026');
  const [dateDesc, setDateDesc] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'days' | 'month-year'>('days');

  const [dropped, setDropped] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Animations
  const successCardScale = useRef(new Animated.Value(0.9)).current;
  const successCardOpacity = useRef(new Animated.Value(0)).current;

  // Keyboard listener
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Update date text when month/year/day changes
  useEffect(() => {
    setDateText(`${selectedDay} ${MONTHS[activeMonth]} ${activeYear}`);
  }, [selectedDay, activeMonth, activeYear]);

  // Permission Request Helpers
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "LDA needs access to your camera to take a memory photo.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const apiLevel = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
      if (apiLevel >= 33) {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        if (hasPermission) return true;
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: "Gallery Permission",
            message: "LDA needs access to your gallery to select a memory photo.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Gallery Permission",
            message: "LDA needs access to your gallery to select a memory photo.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Image Picker Helpers
  const handleCameraLaunch = async () => {
    haptics.medium();
    setPhotoSourceSheetVisible(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission Needed", "Camera permission is required to take photos.");
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setSelectedPhoto(uri);
          }
        }
      }
    );
  };

  const handleGalleryLaunch = async () => {
    haptics.medium();
    setPhotoSourceSheetVisible(false);
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert("Permission Needed", "Gallery permission is required to select photos.");
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled gallery picker');
        } else if (response.errorCode) {
          console.log('Gallery Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setSelectedPhoto(uri);
          }
        }
      }
    );
  };

  const handleDrop = () => {
    let finalContent = '';
    let finalType: 'text' | 'photo' | 'emoji' = 'text';

    if (activeTab === 'text') {
      if (!memoryText.trim()) return;
      finalContent = memoryText.trim();
      finalType = 'text';
    } else if (activeTab === 'photo') {
      if (!selectedPhoto) return;
      finalContent = photoCaption.trim() ? `Photo: ${photoCaption.trim()}` : 'Photo memory';
      finalType = 'photo';
    } else if (activeTab === 'emoji') {
      finalContent = `📅 Date: ${dateText} | ${selectedEmoji} ${dateDesc.trim() || 'Special Day'}`;
      finalType = 'emoji';
    }

    haptics.success();
    Keyboard.dismiss();
    
    // Trigger the premium flying note animation in CommonJar
    jarRef.current?.triggerEnvelope(() => {
      // Callback: save data and transition to success review card
      setDay4Memory(finalContent, finalType);
      addJarMemory({
        content: finalContent,
        type: finalType,
        tinyCompliment: null,
        dayColor: colors.day4,
        photoUri: finalType === 'photo' ? selectedPhoto || undefined : undefined,
      });
      setJarFillLevel(80);
      setDropped(true);

      // Scale in the success card
      Animated.parallel([
        Animated.timing(successCardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(successCardScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleContinue = () => {
    haptics.medium();
    navigation.navigate('Day4TinyCompliment');
  };

  const isFormReady = () => {
    if (activeTab === 'text') return memoryText.trim().length > 0;
    if (activeTab === 'photo') return selectedPhoto !== null;
    if (activeTab === 'emoji') return true;
    return false;
  };

  const getSavedMemoryLabel = () => {
    if (activeTab === 'text') return memoryText.trim();
    if (activeTab === 'photo') return photoCaption.trim() ? `📷 "${photoCaption.trim()}"` : '📷 Photo memory saved';
    return `📅 ${dateText} · ${selectedEmoji} ${dateDesc.trim() || 'A date to remember'}`;
  };

  // Calendar Helpers
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    haptics.light();
    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
    setSelectedDay(1);
  };

  const nextMonth = () => {
    haptics.light();
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
    setSelectedDay(1);
  };

  // Generate calendar days array
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(activeMonth, activeYear);
    const firstDayIndex = getFirstDayOfMonth(activeMonth, activeYear);
    const cells = [];

    // Empty padding cells for first week alignment
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.calendarDayCellEmpty} />);
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDay === day;
      cells.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[styles.calendarDayCell, isSelected && styles.calendarDayCellActive]}
          onPress={() => { haptics.light(); setSelectedDay(day); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextActive]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenWrapper>
        <ProgressStrip currentDay={4} />
        
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <DayHeader eyebrow="Day 4 · The Memory Jar" />

          {!dropped ? (
            // STATE A: INPUT MODE
            <>
              <Text style={styles.title}>Drop one memory here.</Text>
              <Text style={styles.subtitle}>
                A moment with your partner you never want to forget.
              </Text>

              {/* CommonJar Component */}
              <View style={styles.jarContainer}>
                <CommonJar scale={1.4} count={3} ref={jarRef} primaryColor={colors.day4} />
                <Text style={styles.jarLabel}>3 memories saved.</Text>
              </View>

              {/* Option Tabs */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'text' && styles.tabButtonActive]}
                  onPress={() => { haptics.light(); setActiveTab('text'); }}
                  activeOpacity={0.8}
                >
                  <Edit2 size={16} color={activeTab === 'text' ? colors.day4 : colors.textSecondary} />
                  <Text style={[styles.tabLabel, activeTab === 'text' && styles.tabLabelActive]}>Text</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'photo' && styles.tabButtonActive]}
                  onPress={() => { haptics.light(); setActiveTab('photo'); }}
                  activeOpacity={0.8}
                >
                  <Camera size={16} color={activeTab === 'photo' ? colors.day4 : colors.textSecondary} />
                  <Text style={[styles.tabLabel, activeTab === 'photo' && styles.tabLabelActive]}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'emoji' && styles.tabButtonActive]}
                  onPress={() => { haptics.light(); setActiveTab('emoji'); }}
                  activeOpacity={0.8}
                >
                  <Target size={16} color={activeTab === 'emoji' ? colors.day4 : colors.textSecondary} />
                  <Text style={[styles.tabLabel, activeTab === 'emoji' && styles.tabLabelActive, { fontSize: 10 }]} numberOfLines={1}>
                    Save the dates
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Dynamic Form Area */}
              <View style={styles.formContainer}>
                {activeTab === 'text' && (
                  <View style={styles.inputTextContainer}>
                    <TextInput
                      style={styles.inputArea}
                      placeholder="Write your memory here..."
                      placeholderTextColor={colors.textHint}
                      value={memoryText}
                      onChangeText={setMemoryText}
                      multiline
                      maxLength={300}
                      textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{memoryText.length}/300</Text>
                  </View>
                )}

                {activeTab === 'photo' && (
                  <View style={styles.photoContainer}>
                    {!selectedPhoto ? (
                      <TouchableOpacity 
                        style={styles.photoPicker} 
                        onPress={() => { haptics.light(); setPhotoSourceSheetVisible(true); }}
                        activeOpacity={0.7}
                      >
                        <Camera size={28} color={colors.textSecondary} style={{ marginBottom: 8 }} />
                        <Text style={styles.photoPickerLabel}>Tap to upload or take a photo</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.photoPreviewCard}>
                        <View style={styles.photoPreviewWrapper}>
                          <Image 
                            source={{ uri: selectedPhoto }} 
                            style={styles.photoPreviewImage} 
                            resizeMode="cover"
                          />
                          <TouchableOpacity 
                            style={styles.removePhotoBadge} 
                            onPress={() => { haptics.light(); setSelectedPhoto(null); }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.removePhotoText}>✕ Remove</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <TextInput
                          style={styles.photoCaptionInput}
                          placeholder="Add a caption to this memory..."
                          placeholderTextColor={colors.textHint}
                          value={photoCaption}
                          onChangeText={setPhotoCaption}
                        />
                      </View>
                    )}
                  </View>
                )}

                {activeTab === 'emoji' && (
                  <View style={styles.datesContainer}>
                    <Text style={styles.datesSubLabel}>SELECT A DATE THAT MATTERS TO BOTH OF YOU:</Text>
                    
                    {/* Date Selector Pill */}
                    <TouchableOpacity
                      style={styles.dateSelectorPill}
                      onPress={() => { haptics.medium(); setBottomSheetVisible(true); }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.dateSelectorPillLeft}>
                        <Text style={styles.dateSelectorEmoji}>📅</Text>
                        <View style={{ marginLeft: 8 }}>
                          <Text style={styles.dateSelectorLabel}>Selected Date</Text>
                          <Text style={styles.dateSelectorText}>{dateText}</Text>
                        </View>
                      </View>
                      <Text style={styles.dateSelectorActionText}>Change Date</Text>
                    </TouchableOpacity>

                    <Text style={styles.datesSubLabel}>PICK AN EMOJI FOR THIS MILESTONE:</Text>
                    <View style={styles.emojiGrid}>
                      {PRESET_EMOJIS.map((emoji) => (
                        <TouchableOpacity
                          key={emoji}
                          style={[
                            styles.emojiTile,
                            selectedEmoji === emoji && styles.emojiTileActive,
                          ]}
                          onPress={() => { haptics.light(); setSelectedEmoji(emoji); }}
                        >
                          <Text style={styles.emojiTileText}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TextInput
                      style={styles.dateDescInput}
                      placeholder="What makes this date special?"
                      placeholderTextColor={colors.textHint}
                      value={dateDesc}
                      onChangeText={setDateDesc}
                    />
                  </View>
                )}
              </View>
            </>
          ) : (
            // STATE B: SUCCESS MODE
            <View style={styles.successContainer}>
              {/* CommonJar Component showing 4 counts */}
              <View style={styles.jarContainer}>
                <CommonJar scale={1.4} count={4} primaryColor={colors.day4} />
                <Text style={[styles.jarLabel, { color: colors.day4, fontFamily: fonts.dmSansBold }]}>
                  4 memories saved. ✓
                </Text>
              </View>

              {/* Success White Card */}
              <Animated.View 
                style={[
                  styles.successCard,
                  {
                    opacity: successCardOpacity,
                    transform: [{ scale: successCardScale }]
                  }
                ]}
              >
                <Text style={styles.successCardEyebrow}>YOUR MEMORY · DAY 4</Text>
                {activeTab === 'text' && (
                  <Text style={styles.successCardContent}>
                    "{memoryText.trim()}"
                  </Text>
                )}

                {activeTab === 'photo' && (
                  <View style={styles.successPhotoContainer}>
                    {selectedPhoto && (
                      <Image
                        source={{ uri: selectedPhoto }}
                        style={styles.successPhotoPreview}
                        resizeMode="cover"
                      />
                    )}
                    {photoCaption.trim() ? (
                      <Text style={styles.successPhotoCaption}>
                        "{photoCaption.trim()}"
                      </Text>
                    ) : (
                      <Text style={styles.successPhotoCaptionFallback}>
                        A beautiful photo memory saved in the jar.
                      </Text>
                    )}
                  </View>
                )}

                {activeTab === 'emoji' && (
                  <View style={styles.successDateContainer}>
                    <View style={styles.successDatePill}>
                      <Text style={styles.successDateEmoji}>{selectedEmoji}</Text>
                      <View style={styles.successDateTextCol}>
                        <Text style={styles.successDateTitle}>Milestone Date</Text>
                        <Text style={styles.successDateValue}>{dateText}</Text>
                      </View>
                    </View>
                    {dateDesc.trim() ? (
                      <Text style={styles.successDateDesc}>
                        "{dateDesc.trim()}"
                      </Text>
                    ) : (
                      <Text style={styles.successDateDesc}>
                        A special milestone date to remember.
                      </Text>
                    )}
                  </View>
                )}

                {/* Progress bar inside success card */}
                <View style={styles.progressContainer}>
                  <Text style={styles.progressLabel}>Jar 80% full · One more day to go</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '80%', backgroundColor: colors.day4 }]} />
                  </View>
                </View>
              </Animated.View>
            </View>
          )}

          <View style={{ height: responsiveHeight(12) }} />
        </ScrollView>

        {/* CTA Area */}
        {!isKeyboardVisible && (
          <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
            {!dropped ? (
              <>
                <GradientButton
                  text="Drop it in the jar"
                  onPress={handleDrop}
                  disabled={!isFormReady()}
                  fullWidth
                  // variant="lavenderSky"
                  gradientColors={colors.gradientBtn}
                  style={{ marginBottom: metrics.spacing.sm }}
                />
                
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={() => {
                    haptics.light();
                    setDay4Memory(null, 'skipped');
                    navigation.navigate('Day4TinyCompliment');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipBtnText}>Skip for now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <GradientButton
                text="Continue"
                onPress={handleContinue}
                fullWidth
                // variant="lavenderSky"
                gradientColors={colors.gradientBtn}
              />
            )}
          </View>
        )}

        <CustomBottomSheet
          visible={bottomSheetVisible}
          onClose={() => {
            haptics.light();
            setBottomSheetVisible(false);
            setCalendarMode('days');
          }}
          title={calendarMode === 'days' ? "Select Memory Date" : "Jump to Month & Year"}
        >
          {calendarMode === 'days' ? (
            <View style={styles.bottomSheetCalendarContainer}>
              {/* Header Month/Year Selector */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={prevMonth} style={styles.calendarHeaderBtn}>
                  <ChevronLeft size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { haptics.medium(); setCalendarMode('month-year'); }}
                  style={styles.calendarHeaderTitleBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.calendarMonthText}>
                    {MONTHS[activeMonth]} {activeYear} ▾
                  </Text>
                  <Text style={styles.calendarTapToQuickSelect}>Tap to quick-select</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextMonth} style={styles.calendarHeaderBtn}>
                  <ChevronRight size={16} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Day Name Labels */}
              <View style={styles.weekdaysRow}>
                {WEEKDAYS.map(day => (
                  <Text key={day} style={styles.weekdayText}>{day}</Text>
                ))}
              </View>

              {/* Days Number Grid */}
              <View style={styles.daysGrid}>
                {renderCalendarDays()}
              </View>

              {/* Selected Preview Pill */}
              <View style={styles.datePreviewPill}>
                <Text style={styles.datePreviewText}>Selected: {dateText}</Text>
              </View>

              {/* Confirm CTA */}
              <TouchableOpacity
                style={[styles.bottomSheetConfirmBtn, { backgroundColor: colors.day4 }]}
                onPress={() => { haptics.medium(); setBottomSheetVisible(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.bottomSheetConfirmBtnText}>Confirm Date</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.monthYearPickerContainer}>
              <Text style={styles.pickerSectionTitle}>SELECT MONTH</Text>
              <View style={styles.monthsGrid}>
                {MONTHS.map((monthName, idx) => {
                  const isSelected = activeMonth === idx;
                  return (
                    <TouchableOpacity
                      key={monthName}
                      style={[
                        styles.monthSelectorCell,
                        isSelected && [styles.monthSelectorCellActive, { borderColor: colors.day4 }]
                      ]}
                      onPress={() => {
                        haptics.light();
                        setActiveMonth(idx);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.monthSelectorText,
                          isSelected && [styles.monthSelectorTextActive, { color: colors.day4 }]
                        ]}
                      >
                        {monthName.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.pickerSectionTitle}>SELECT YEAR</Text>
              <ScrollView 
                style={styles.yearsScroll} 
                contentContainerStyle={styles.yearsGrid}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {Array.from({ length: 52 }, (_, i) => 1980 + i).map(year => {
                  const isSelected = activeYear === year;
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearSelectorCell,
                        isSelected && [styles.yearSelectorCellActive, { borderColor: colors.day4 }]
                      ]}
                      onPress={() => {
                        haptics.light();
                        setActiveYear(year);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.yearSelectorText,
                          isSelected && [styles.yearSelectorTextActive, { color: colors.day4 }]
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Actions */}
              <TouchableOpacity
                style={[styles.bottomSheetConfirmBtn, { backgroundColor: colors.day4, marginTop: 16 }]}
                onPress={() => {
                  haptics.medium();
                  setCalendarMode('days');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.bottomSheetConfirmBtnText}>Apply & View Days</Text>
              </TouchableOpacity>
            </View>
          )}
        </CustomBottomSheet>

        <CustomBottomSheet
          visible={photoSourceSheetVisible}
          onClose={() => {
            haptics.light();
            setPhotoSourceSheetVisible(false);
          }}
          title="Select Photo"
        >
          <View style={styles.photoSourceContainer}>
            <TouchableOpacity
              style={styles.photoSourceOption}
              onPress={handleCameraLaunch}
              activeOpacity={0.8}
            >
              <View style={[styles.photoSourceIconBg, { backgroundColor: `${colors.day4}15` }]}>
                <Camera size={22} color={colors.day4} />
              </View>
              <View style={styles.photoSourceTextContainer}>
                <Text style={styles.photoSourceTitle}>Take Photo</Text>
                <Text style={styles.photoSourceSub}>Use camera to capture a moment</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoSourceOption}
              onPress={handleGalleryLaunch}
              activeOpacity={0.8}
            >
              <View style={[styles.photoSourceIconBg, { backgroundColor: `${colors.day4}15` }]}>
                <ImageIcon size={22} color={colors.day4} />
              </View>
              <View style={styles.photoSourceTextContainer}>
                <Text style={styles.photoSourceTitle}>Choose from Gallery</Text>
                <Text style={styles.photoSourceSub}>Select an existing photo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </CustomBottomSheet>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
  },
  title: {
    ...typography.displayMedium,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodySmall,
    color: c.textSecondary,
    fontFamily: fonts.dmSansRegular,
    lineHeight: 18,
    marginBottom: metrics.spacing.md,
  },

  // ── Jar Component ──────────────────────────────────────
  jarContainer: {
    alignItems: 'center',
    marginVertical: metrics.spacing.sm,
  },
  jarLabel: {
    ...typography.caption,
    color: c.accent,
    fontFamily: fonts.dmSansMedium,
    marginTop: 10,
  },

  // ── Tabs ────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: metrics.radius.lg,
    padding: 4,
    marginBottom: metrics.spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: metrics.radius.md,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: metrics.fontSize.caption,
    color: c.textSecondary,
    fontFamily: fonts.dmSansMedium,
  },
  tabLabelActive: {
    color: c.text,
    fontFamily: fonts.dmSansBold,
  },

  // ── Form Content ────────────────────────────────────────
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: c.glassBorder,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: metrics.spacing.md,
    minHeight: 160,
  },
  inputTextContainer: {
    position: 'relative',
    flex: 1,
  },
  inputArea: {
    color: c.text,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 2,
  },
  charCount: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 10,
    color: c.textHint,
    fontFamily: fonts.dmSansMedium,
  },
  photoContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  photoPicker: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: c.surfaceBorder,
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  photoPickerLabel: {
    fontSize: 13,
    color: c.textSecondary,
    fontFamily: fonts.dmSansMedium,
  },
  photoPreviewCard: {
    gap: metrics.spacing.md,
  },
  photoPreviewWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  photoPreviewImage: {
    height: 180,
    width: '100%',
    borderRadius: 12,
  },
  removePhotoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
  },
  photoSourceContainer: {
    paddingVertical: 12,
    gap: 16,
  },
  photoSourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  photoSourceIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSourceTextContainer: {
    flex: 1,
  },
  photoSourceTitle: {
    fontSize: 15,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  photoSourceSub: {
    fontSize: 12,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    marginTop: 2,
  },
  photoCaptionInput: {
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: c.text,
    fontSize: 14,
    fontFamily: fonts.dmSansRegular,
    backgroundColor: '#FFFFFF',
  },

  // ── Dates / Calendar Container ──
  datesContainer: {
    gap: 8,
  },
  datesSubLabel: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 4,
  },
  dateSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: c.surfaceBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
  },
  dateSelectorPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSelectorEmoji: {
    fontSize: 20,
  },
  dateSelectorLabel: {
    fontSize: 10,
    color: c.textHint,
    fontFamily: fonts.dmSansMedium,
  },
  dateSelectorText: {
    fontSize: 14,
    color: c.text,
    fontFamily: fonts.dmSansBold,
  },
  dateSelectorActionText: {
    fontSize: 12,
    color: c.day4,
    fontFamily: fonts.dmSansBold,
  },
  bottomSheetCalendarContainer: {
    paddingVertical: 8,
  },
  calendarHeaderTitleBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarTapToQuickSelect: {
    fontSize: 9,
    color: c.textHint,
    fontFamily: fonts.dmSansMedium,
    marginTop: 1,
  },
  bottomSheetConfirmBtn: {
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomSheetConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.dmSansBold,
  },
  monthYearPickerContainer: {
    paddingVertical: 8,
  },
  pickerSectionTitle: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
    letterSpacing: 1.0,
    marginBottom: 10,
    marginTop: 10,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthSelectorCell: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthSelectorCellActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  monthSelectorText: {
    fontSize: 12,
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
  },
  monthSelectorTextActive: {
    fontFamily: fonts.dmSansBold,
  },
  yearsScroll: {
    maxHeight: 140,
    marginVertical: 4,
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  yearsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 12,
  },
  yearSelectorCell: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearSelectorCellActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  yearSelectorText: {
    fontSize: 12,
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
  },
  yearSelectorTextActive: {
    fontFamily: fonts.dmSansBold,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarHeaderBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthText: {
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    paddingBottom: 4,
  },
  weekdayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDayCell: {
    width: `${100 / 7}%`,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  calendarDayCellEmpty: {
    width: `${100 / 7}%`,
    height: 32,
  },
  calendarDayCellActive: {
    backgroundColor: c.day4,
    borderRadius: 16,
  },
  calendarDayText: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.text,
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.dmSansBold,
  },
  datePreviewPill: {
    alignSelf: 'center',
    backgroundColor: c.glassLight,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  datePreviewText: {
    fontSize: 11,
    color: c.textSecondary,
    fontFamily: fonts.dmSansBold,
  },

  // Emoji preset tiles
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  emojiTile: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  emojiTileActive: {
    backgroundColor: '#FFFFFF',
    borderColor: c.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emojiTileText: {
    fontSize: 18,
  },
  dateDescInput: {
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: c.text,
    fontSize: 14,
    fontFamily: fonts.dmSansRegular,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },

  // ── Success Mode ────────────────────────────────────────
  successContainer: {
    alignItems: 'center',
    gap: metrics.spacing.md,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: metrics.spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    gap: 12,
  },
  successCardEyebrow: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
    fontFamily: fonts.dmSansBold,
  },
  successCardContent: {
    fontSize: 16,
    color: c.textDark || '#1A2332',
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 24,
  },
  progressContainer: {
    marginTop: metrics.spacing.xs,
    gap: 6,
  },
  progressLabel: {
    fontSize: 10,
    color: c.textHint,
    fontFamily: fonts.dmSansMedium,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Success Photo Preview Styles
  successPhotoContainer: {
    gap: 8,
    alignItems: 'stretch',
    marginTop: 4,
  },
  successPhotoPreview: {
    height: 160,
    width: '100%',
    borderRadius: 14,
  },
  successPhotoCaption: {
    fontSize: 14,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 4,
  },
  successPhotoCaptionFallback: {
    fontSize: 12,
    color: c.textHint,
    fontFamily: fonts.dmSansRegular,
    textAlign: 'center',
    marginTop: 4,
  },

  // Success Date Preview Styles
  successDateContainer: {
    gap: 10,
    marginTop: 4,
  },
  successDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  successDateEmoji: {
    fontSize: 28,
  },
  successDateTextCol: {
    flex: 1,
  },
  successDateTitle: {
    fontSize: 10,
    color: c.textHint,
    fontFamily: fonts.dmSansBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  successDateValue: {
    fontSize: 14,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    marginTop: 1,
  },
  successDateDesc: {
    fontSize: 14,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 20,
  },

  // ── CTA Wrapper ─────────────────────────────────────────
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  mainBtn: {
    backgroundColor: c.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtnDisabled: {
    backgroundColor: c.textHint,
    opacity: 0.5,
  },
  mainBtnText: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.smMd,
  },
  skipBtnText: {
    fontSize: 12,
    color: c.textHint,
    fontFamily: fonts.dmSansRegular,
    textDecorationLine: 'underline',
  },
});
