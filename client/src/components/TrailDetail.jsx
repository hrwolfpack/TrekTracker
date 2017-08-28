import React from 'react'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

class TrailDetail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      address: this.props.trail.city + ', ' + this.props.trail.state,
      length: this.props.trail.length + ' miles',
    }
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.trail.name}
          subtitle={this.state.address}
        />
      <CardText expandable={false}>
          <div>
            <p><strong>Trail length: </strong>{this.state.length}</p>
            <p><strong>Description: </strong>{this.props.trail.description}</p>
          </div>
        </CardText>
      </Card>
    );
  }
}


export default TrailDetail;
