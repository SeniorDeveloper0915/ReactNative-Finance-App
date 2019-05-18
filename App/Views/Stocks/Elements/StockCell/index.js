'use strict';

var React = require('react-native');
var Reflux = require('reflux');
var store = require('react-native-simple-store');

var {
  Text,
  TouchableHighlight,
  View,
} = React;

// Flux
var Actions = require('../../../../Utils/actions');
var Store = require('../../../../Utils/store');

// Styles
var styles = require('./style');

var StockCell = React.createClass({
  mixins: [Reflux.ListenerMixin],

  onChangeShowingProperty: function(data) {
    this.setState({
      showingProperty: data,
    });
  },

  getInitialState: function() {
    return {
      showingProperty: 'Change',
    };
  },

  componentDidMount: function() {
    this.listenTo(Store, this.onChangeShowingProperty);

    store.get('showingProperty').then((result) => {
      if (!result) {
        result = 'Change';
        store.save('showingProperty', result);
      }
      this.setState({
        showingProperty: result,
      });
    });
  },

  getShowingProperty: function () {
    store.get('showingProperty').then((result) => {
      return result;
    });
  },

  changeShowingProperty: function(currentShowingProperty) {
      var newShowingProperty;
      if (currentShowingProperty === 'Change') {
        newShowingProperty = 'ChangeinPercent';
      } else if (currentShowingProperty === 'ChangeinPercent') {
        newShowingProperty = 'MarketCapitalization';
      } else if (currentShowingProperty === 'MarketCapitalization') {
        newShowingProperty = 'Change';
      }
      store.save('showingProperty', newShowingProperty);
      Actions.changeShowingProperty(newShowingProperty);
      // this.props.onRefreshStocksView();
  },

  render: function() {
    console.log(this.props.stock);
    return (
      <TouchableHighlight onPress={this.props.onSelect} underlayColor='#202020'>
        <View style={styles.container}>
          <View style={styles.stockContainer}>
            <View style={styles.stockSymbol}>
              <Text style={styles.stockSymbolText}>
                {this.props.stock.Symbol}
              </Text>
            </View>
            <View style={styles.stockPrice}>
              <Text style={styles.stockPriceText}>
                {this.props.stock.LastTradePriceOnly}
              </Text>
            </View>
            <TouchableHighlight
                style={(() => {
                  switch (this.props.stock.Change && this.props.stock.Change.startsWith('+')) {
                    case true:                   return styles.stockChangeGreen;
                    case false:                  return styles.stockChangeRed;
                    default:                     return styles.stockChangeGreen;
                  }
                })()}
                underlayColor={(() => {
                  switch (this.props.stock.Change && this.props.stock.Change.startsWith('+')) {
                    case true:                   return '#53D769';
                    case false:                  return '#FC3D39';
                    default:                     return '#53D769';
                  }
                })()}
                onPress={() => this.changeShowingProperty(this.state.showingProperty)}>
              <View>
                <Text style={styles.stockChangeText}>
                  {(() => {
                    switch (this.state.showingProperty) {
                      case 'Change':                 return this.props.stock.Change || '--';
                      case 'ChangeinPercent':        return this.props.stock.ChangeinPercent || '--';
                      case 'MarketCapitalization':   return this.props.stock.MarketCapitalization || '--';
                      default:                       return this.props.stock.Change || '--';
                    }
                  })()}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = StockCell;
