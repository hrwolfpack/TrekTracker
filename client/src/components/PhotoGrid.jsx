import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1000,
    height: 'auto',
    overflowY: 'auto',
  },
};

class PhotoGrid extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props.posts)
    return (
      <div>
        <div style={styles.root}>
          <GridList
            cols={3}
            cellHeight={200}
            cellWidth={200}
            style={styles.gridList}
          >
          <Subheader>Trail Photos</Subheader>
            {this.props.posts.map((photo, index) => (
              <GridTile
                key={index}
                title={photo.text}
              >
                <img src={photo.image_url} />
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }
}

export default PhotoGrid;
