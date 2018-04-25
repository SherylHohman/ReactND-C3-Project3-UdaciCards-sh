import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// actionCreators, reducers, selectors, Api's
import { getDeckInfo } from '../store/decks/selectors';
// import { getDeck } from '../store/decks/selectors';
import { saveDeckTitle, updateDeckTitle, removeDeck, fetchDecks } from '../utils/api';
// Constants, Helpers
import { white, gray, primaryColor, primaryColorLight, primaryColorDark,
         isCorrectColor, isIncorrectColor
       } from '../utils/colors';

class Deck extends React.Component {

  // state = {
  //   oldTitle: '',
  //   newTitle: '',
  // }

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params;
    return { title: `${title} Quiz Deck`}
  }

  onRename(){
    console.log('in onRename');
    // // update DB
    // updateDeckTitle()
    // // then update Store
    // // then navigate to Home
  }

  onDelete(){
    const { title, id, numCards } = this.props.deckInfo;
    console.log('Deck.js, onDelete, id:', id);
    // update DB
    removeDeck(id)
    // then update Store
    // .then(() => fetchDecks())
    // as this should be dispatched as update decks
    // .then((decks) => this.props.dispatch(receivedDecks(decks)))
    // fetchDecks()
    .then((decks) => {
      console.log('Deck.js, onDelete, after removeDeck, received decks:/n', decks);
      this.props.dispatch(receivedDecks(decks));
      console.log('dispatched updated decks to store, navigating home..');
    })
    // then navigate to Home
    // // .then(() => this.props.navigation.navigate('Home');)
    // .then(() => this.props.navigation.navigate('Home'));
    .catch((err) => console.log('error removing deck id:', id));
    this.props.navigation.navigate('Home');
  }

    //   // read data from localStore, then dispatch/save to redux store
    // fetchDecks()
    //   .then((decks) => dispatch(receivedDecks(decks)))
    //   .then(({ decks }) => this.setState({
    //     isFetching: false,
    //     isFetchFailure: false
    //   }))

    //   .catch(err => {
    //     dispatch(receiveDecksFailure(err))
    //     this.setState({
    //       isFetching: false,
    //       isFetchFailure: true,
    //     });
    //   });
  // }


  render() {
    const { title, id, numCards } = this.props.deckInfo;
    // const numCards = this.props.deck.questions.length;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleText}>Deck: {title}</Text>
          <Text style={styles.infoText}>
          {numCards} {(numCards === 1) ? 'Question' : 'Questions'}
          </Text>
        </View>

        <StyledButton
          customColor={isCorrectColor}
          onPress={() => this.props.navigation.navigate(
            'Quiz',
            /* below passes in as: this.props.navigation.state.params.id*/
            { id, title }
          )}
        >
        Take Quiz !
        </StyledButton>

        <StyledButton
          customColor={primaryColorLight}
          onPress={() => this.props.navigation.navigate(
            'NewCard',
            /* below passes in as: this.props.navigation.state.params.id*/
            { id }
          )}
        >
        Add a New Question
        </StyledButton>

        <StyledButton
          customColor={primaryColor}
          onPress={() => this.onRename()}
        >
        Rename
        </StyledButton>

        <StyledButton
          customColor='red'
          onPress={() => this.onDelete()}
        >
        Delete (Cannot be Undone)
        </StyledButton>
      </View>
    );
  }
}


// // TODO: adjust styles to resemble Quiz.
// //   use below to help with alignment.
// const testing = false;
// const borderWidth = testing ? 2 : 0;

//     //TEMP
//     borderColor: 'red'  (containers)
//     borderWidth,
//     borderColor: 'blue' (text)
//     borderWidth,

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  titleText: {
    fontSize: 27,
    color: primaryColor,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 20,
    color: gray,
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: white,
    padding:     20,
    marginLeft:  10,
    marginRight: 10,
    marginTop:   10,
    borderRadius: Platform.OS === 'ios' ? 20 : 10,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});

function mapStoreToProps(store, ownProps){
  // console.log(ownProps);
  const deckInfo  = getDeckInfo(store, ownProps.navigation.state.params.id) || null;
  // const deck  = getDeck(store, ownProps.navigation.state.params.id) || null;
  // TODO: *maybe* fetch the deck proper (with questions) even though I don't use
  //       questions in this component.  Then just pass the whole deck to children
  //       since both children need questions, and they won't have to then get them.

  return {
    deckInfo,
  }
}

export default connect(mapStoreToProps)(Deck);
