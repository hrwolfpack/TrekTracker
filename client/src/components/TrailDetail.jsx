import React from 'react'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

class TrailDetail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      address: this.props.trail.city + ', ' + this.props.trail.state,
      length: 'Trail length: ' + this.props.trail.length + ' miles',
      activity: this.props.trail.activity_type,
      description: 'Description: ' + this.props.trail.description
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
            <p>{this.state.length}</p>
            <p>{this.state.description}</p>
          </div>
        </CardText>
      </Card>
    );
  }
}


export default TrailDetail;
