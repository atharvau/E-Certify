import React, { Component } from "react";
import { Grid, Typography, Avatar, Card, Button } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import AssignmentIcon from "@material-ui/icons/Assignment";
import green from "@material-ui/core/colors/green";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MailIcon from "@material-ui/icons/Mail";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@material-ui/core";

import ipfs from "../ipfs";
class LinkedAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hj: [],
      currentState: { a: "", b: "", name: "", pic: "" },
      newinstadd: ""
    };
  }

  componentDidMount = async () => {
    await this.verify();
  };
  verify = async () => {
    const { accounts, contract } = this.props;

    const re = await contract.methods.getInstitutesWallet(accounts[0]).call();
    var h = [];

    re.map(async re => {
      var assa = await contract.methods.getChangeOwnerList(re).call();
      console.log("AA", re);

      var getDet = await contract.methods.getProfile(re).call();
      h.push({ a: re, b: assa[0], name: getDet[0], pic: getDet[1] });
    });

    this.setState({ hj: h });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClickOpen1 = () => {
    this.handleClose();
    this.setState({ open1: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleClose1 = () => {
    this.handleClose();
    this.setState({ open1: false });
  };

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log(event.target.files);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      // this.setState({ buffer: Buffer(reader.result) });
      //   console.log("buffjmnnnnnnnnnnnnnnnnnner", Buffer(reader.result));

      this.hj(Buffer(reader.result));
    };
  };

  onCreate = async () => {
    const { accounts, contract } = this.props;

    await contract.methods
      .createUploadRequestbyInstitute(
        this.state.currentState.a,
        true,
        this.state.profilepic
      )
      .send({ from: accounts[0] });
    var uplist = await contract.methods
      .getUploadReqList(this.state.currentState.a)
      .call();
    console.log(uplist);
  };

  hj = async a => {
    await ipfs.add(a, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      this.setState({ profilepic: ipfsHash[0].hash });
    });
  };
  changeinst = async () => {
    const { accounts, contract } = this.props;
    await contract.methods
      .changeOwnerInstfromInst(this.state.currentState.a, this.state.newinstadd)
      .send({ from: accounts[0] });
    var r = await contract.methods
      .getChangeOwnerList(this.state.currentState.a)
      .call();
    console.log(r);
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "white",
          height: "1000px",
          marginTop: "90px"
        }}
      >
        <h1>Linked Accounts </h1>
        {this.state.hj.map(hj => {
          return (
            <div>
              <Grid container>
                <Grid item md={1} />
                <Grid
                  item
                  md={8}
                  style={{ width: "400px", paddingTop: "50px" }}
                >
                  <Card style={{ width: "900px" }}>
                    <Grid container style={{ padding: "20px" }}>
                      <Grid container>
                        <Grid item md={2} style={{ marginLeft: "25px" }}>
                          <Avatar
                            style={{
                              color: "#fff",
                              backgroundColor: green[500],
                              width: "75px",
                              height: "75px"
                            }}
                            src={hj.pic}
                          />
                        </Grid>

                        <Grid item md={4}>
                          <Typography variant="headline">{hj.name}</Typography>
                          <Typography variant="overline">
                            ADDRESS : {hj.a.substring(0, 10)}
                          </Typography>
                          <br />
                        </Grid>
                        <Grid item md={1} />
                        <Grid item md={1}>
                          <br />
                          <Button
                            onClick={() => {
                              this.setState({
                                open: !this.state.open,
                                currentState: hj
                              });
                            }}
                            variant="outlined"
                          >
                            View
                          </Button>
                        </Grid>
                        <Grid item md={1} />
                        <Grid item md={1}>
                          <br />
                          <Button
                            onClick={() => {
                              this.setState({
                                open1: !this.state.open1,
                                currentState: hj
                              });
                            }}
                            style={{ width: "200px" }}
                            variant="outlined"
                          >
                            Change Institute
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </div>
          );
        })}

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div style={{ marginLeft: "30px", marginRight: "30px" }}>
            <DialogTitle id="form-dialog-title">
              <Typography style={{ color: "#1a237e" }} variant="h4">
                Profile
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText style={{ color: "black" }}>
                <Typography variant="h5">
                  {" "}
                  Name : {this.state.currentState.name}
                </Typography>
                <Typography variant="overline">
                  ADDRESS : {this.state.currentState.a}
                </Typography>
              </DialogContentText>
              <br />
              {/* <DialogContentText style={{ marginTop: "15px" }}>
              Create New Upload
            </DialogContentText> */}
              <Grid container justify="center">
                <img
                  alt="CNN"
                  style={{ margin: "20px", height: "200px", width: "200px" }}
                />
              </Grid>{" "}
              <DialogContentText style={{ color: "black" }}>
                Documents{" "}
                <Typography variant="caption">
                  (Click to send View Request)
                </Typography>
              </DialogContentText>
              <List style={{ width: "500px" }}>
                <ListItem button>
                  <ListItemText>Adhar Card</ListItemText>
                  <Button>
                    <input onChange={this.captureFile} type="file" />
                  </Button>
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemText>Class X Marksheet</ListItemText>
                  <Button>
                    {" "}
                    <input onChange={this.captureFile} type="file" />
                  </Button>
                </ListItem>
                <Divider />
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>

              <Button onClick={this.onCreate} color="primary">
                Create New Upload Request
              </Button>
            </DialogActions>
          </div>
        </Dialog>
        <Dialog
          open={this.state.open1}
          onClose={this.handleClose1}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography style={{ color: "#1a237e" }} variant="h4">
              Chnage Institute Of student
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "black" }}>
              <Typography variant="h5">
                {" "}
                Name : {this.state.currentState.name}
              </Typography>
              <Typography variant="overline">
                ADDRESS : {this.state.currentState.a}
              </Typography>
              <Typography variant="h6">
                Enter Address of new Institute
              </Typography>
            </DialogContentText>
            <TextField
              id="standard-with-placeholder"
              label="Address*"
              placeholder="Enter Address"
              margin="normal"
              style={{ width: "250px" }}
              onChange={e => {
                {
                  this.setState({ newinstadd: e.target.value });
                }
              }}
            />{" "}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose1} color="primary">
              Cancel
            </Button>
            <Button onClick={this.changeinst} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LinkedAccount;
