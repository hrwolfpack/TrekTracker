import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import {Modal, Button} from 'react-bootstrap';
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
    this.state = {
      showModal: false,
      currentPost: ''
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }


  openModal () {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  handleClick (e) {
    e.persist();
    this.setState({
      currentPost: e.target.currentSrc
    })
    this.openModal();
    console.log(e);
  }

  render() {
    console.log(this.props.posts)
    return (
      <div>
        <Modal className="modal-container"
         show={this.state.showModal}
         onHide={this.close}
         animation={true}
         bsSize="large">

         <Modal.Body>
           <img className='img-responsive center-block' src={this.state.currentPost}/>
         </Modal.Body>

         <Modal.Footer>
           <Button onClick={this.closeModal}>Close</Button>
         </Modal.Footer>
       </Modal>
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
              onClick={(e) => this.handleClick(e)}
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
