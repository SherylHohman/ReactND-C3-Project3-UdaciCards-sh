import React from 'react';
import { View, Text, TouchableOpacity,
         TextInput, KeyboardAvoidingView,
         StyleSheet, Platform,
       } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// Constants, Helpers, Api's
import { retrieveDecks }    from '../utils/api';
import { saveDeckTitle } from '../utils/api';
// Constants, Helpers
import { titleCase, stripInvalidChars, makeStringUnique }
  from '../utils/helpers';
import { white, gray, primaryColor, primaryColorDark, primaryColorLight,
       } from '../utils/colors';

// dev  TODO: only enable this import (and its invocation) while in dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class NewDeck extends React.Component {

  // TODO: static.. add TabNavigator Header (optional)

  state = {
    title: '',
    canSubmit: false,

    // not expected to change once decks is "fetched" in cDM
    // (if using redux, this would be in props instead, and determined by mSTP selector)
    existingTitles: [],
  }

componentDidMount () {
  //TODO: fetchDecks in App.js instead, and pass decks in to via TabNavigator
  //      (to both tabs: NewDeck -and- DeckList)

  // if decks is passed in (ie link from DeckList, where decks is known to be an EMPTY array)
  let decksArray = (this.props.navigation &&
               this.props.navigation.state.params &&
               this.props.navigation.state.params.decks) || undefined;
  if (decksArray) {
      const titles = decksArray.map( deck => title );
      this.setState({ existingTitles: titles });
      return;
  }
  else {
  // deck not passed in (ie got here by clicking on tab, not via internal nav, or from a link)
    console.log('NewDeck.cDM decks not passed in,so fetching" them..', this.props);
    retrieveDecks()
      .then((decksObj) => {
        // not expected to change during life of this component
        const existingTitles = decksObj && Object.keys(decksObj) || [];
        this.setState({ existingTitles });
      });
  }

  // another attempt to get focus into TextInput, and keyboard to pop up at cDM !
  // this.textInputRef.focus()
}

  controlledTextInput(title){
    title = titleCase(stripInvalidChars(title));
    const canSubmit = this.isValidInput(title);
    this.setState({ title, canSubmit });
  }

  isValidInput(text){
    // TODO: show "invalid title" message to user instead, and disable sSubmit btn,
    //       so they control how to make the title unigue, instead of
    //       me silently appending a number to the title
    return text.trim() !== '';
    // TODO: check for unique title, and require user to edit it
  }

  // onBlur(){
  //   // title = this.state.title.trim();
  //   // const unique = makeStringUnique(title, this.props.existingTitles);
  //   // // TODO: if unique !== title, highlight this to the user, so they can edit
  //   // //       if they don't like the revised title
  //   // this.setState({ title: unique });
  // }

  canSubmit(){
    return (!this.state.errorMessage && this.state.beenTouched);
  }

  onSubmit(){
    // console.log('____in NewDeck.onSubmit____');
    const { existingTitles, canSubmit } = this.state;
    let title = this.state.title;

    title = makeStringUnique(title.trim(), existingTitles)

    // send to "DB"
    saveDeckTitle(title)
      .then(()=>{
        // if was using redux, could navigate without waiting on a `then`..
        //   because, whenever the redux store updated, "Home" would re-render.
        //  since I'm not, must make sure AsyncStorage has updated before
        //   navigate to the next page - b/c it only fetches/updates titles at cDM
        this.props.navigation.navigate('Home');
        return;
      })

      .catch((err) => {
        console.log('____NewDeck____, onSubmit, error saving new DeckTitle, err:', err);
        // not sure IF I should call `navigate` for the case of storage error
        this.props.navigation.navigate('Home');
        return (err);
      });

    console.log('..exiting NewDeck onSubmit (but the async saveDeckTitle is probably still running)');
  }

  render() {

                  // /* ref={ref => this.textInputRef = ref} */   /*`this.textInputRef.focus()` must be called in cDM */

                  // onBlur={() => this.onBlur()}
                  // onSubmitEditing={() => this.onSubmit()}

                  // blurOnSubmit
                  // onSubmitEditing={({ nativeEvent }) => this.setState({ title: nativeEvent.title })} />

      return (
          <View style={styles.container}>
            <View style={[styles.cardContainer, {flex: 1}]}>
              <Text  style={styles.instructionsText}
                >
                Title for your New Quiz Deck
              </Text>

              <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
                <TextInput {...textInputProps}
                  style={styles.textInput}
                  value={this.state.title}
                  onChangeText={(title) => this.controlledTextInput(title)}
                  />
              </KeyboardAvoidingView>
            </View>

            <KeyboardAvoidingView
              {...keyboardAvoidingViewProps}
              style={[styles.buttonsContainer, styles.buttonContainer]}
              >
              <StyledButton
                style={[styles.item, style={flex: 2}]}
                onPress={() => this.onSubmit()}
                disabled={!this.state.canSubmit}
                >
                <Text>
                  Submit
                </Text>
              </StyledButton>
            </KeyboardAvoidingView>
          </View>
      );

  }
}

let textInputProps = {
  placeholder: 'Quiz Deck Title',
  autoFocus: true,
  maxLength: 25,
  autoCapitalize: 'words',
  autoCorrect: false,
  returnKeyType: 'send',
  placeholderTextColor: gray,
  selectionColor: primaryColorLight,
}
// if (Platform.OS==='ios'){
//   textInputProps = {
//     ...textInputProps,
//     enablesReturnKeyAutomatically: true, // disables return key if no text
//     keyboardAppearance: 'light',
//     spellCheck: true,
//   }
// }
// if (Platform.OS==='android'){
//   textInputProps = {
//     ...textInputProps,
//   }
// }

  // // Props for <TextInput>
  // let textInputProps = {
  //   // if multiline, "enter" key will "submit", instead of adding a newline
  //   blurOnSubmit=true,

  //   // TODO: pull keyboard up automatically if phone does Not have Physical keyboard
  //   // TODO: get height of soft Kyeboard
  //   //       - edit layout design to render in the area unoccupied by the
  //   //         keyboard (even when it is not showing),
  //   //         but allow it to take up more vertical space if needed,
  //   //         (but only while keyboard is *not* showing)
  //   //         also add scrollView just in case, so user can access hidden content.

  //   // TODO: open softKeyboard, if device does not have physical keyboard
  //   //       onFocus={}

  //   // TODO: should I use onKeyPress instead of putting logic in onChange ??

  //   /* onEndEditing={(title) => this.setState({title: title.trim()})} */
  //   /* onBlur={(title) => this.setState({title: title.trim()})} */
  //   /* clearButtonMode={"while-editing"} */

  //   /* ref={ref => {this._emailInput = ref}} */

  //   /* onSubmitEditing={this._submit} */ // invalid if {multi-line === true}
  // };

const keyboardAvoidingViewProps = {
  // Options for `behavior` : enum('height', 'position', 'padding')
  behavior: 'padding',
};
// TODO: DELETE UNUSED STYLES

let componentStyles = {
  // CONTAINER styles
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 10,
    paddingTop: 30,
    paddingBottom: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#fefefe',

    padding:     20,
    marginLeft:  30,
    marginRight: 30,
    marginTop:   10,
    borderRadius: Platform.OS === 'ios' ? 20 : 10,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginBottom:20,
  },
  buttonsContainer: {
    flex: 3,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    justifyContent: 'center',
    margin: 10,
  },

  // TEXT Styles
  instructionsText: {
    flex: 1,
    fontSize: 20,
    color: gray,

    alignSelf: 'center',
    textAlign: 'center',
  },

  // INPUTTEXT styles
  textInput: {
    fontSize: 27,
    color: primaryColor,

    alignSelf: 'stretch',
    flexWrap:  'wrap',
    textAlign: 'center',
    marginTop: 10,
  },
};
// if (Platform.OS = 'android'){
//   componentStyles = {
//     ...componentStyles,
//     // underlineColorAndroid: primaryColorDark,
//   };
// }

// set to `false` for normal view, and production.
// set to `true`  to troubleshoot/test/visualize style layouts
//         Adds border outlines to styles to aid in UI layout design
//         Use only temporarily for editing styles/layout/UI-design.
const viewStyleLayout = false;
if (viewStyleLayout) {componentStyles = augmentStylesToVisualizeLayout(componentStyles);}

const styles = StyleSheet.create({
  ...componentStyles,
});

// TODO: propTypes: navigate, decks

export default NewDeck;
