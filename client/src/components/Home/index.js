import React, { useState, useEffect } from "react";
import SDK from "blocksdk";

import "bootstrap/dist/css/bootstrap.css";
import {
  InputGroup,
  FormControl,
  Card,
  Col,
  Modal,
  Button,
  Row,
} from "react-bootstrap";
import "./style.css";

const Home = () => {
  const [show, setShow] = useState(false);
  const [contents, setContents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [conSent, setConSent] = useState(null);

  var sdk = new SDK(null, null, true); // 3rd argument true bypassing https requirement: not prod worthy

  useEffect(() => {
    sdk.getData(function (data) {
      setConSent(data?.mapsKey || "");
      paintSettings();
      paintEmail();
    });
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openModal = async () => {
    setLoading(true);
    const response = await fetchData();
    setLoading(false);
    setContents(response);
    handleShow();
  };

  const fetchData = async () => {
    const response = await fetch(
      "https://cdx-cms.dev.depthcon1.com/consents?Type=TermAndConditionConsent"
    );
    const mapResponseToJson = await response.json();
    return mapResponseToJson;
  };

  const handleSelectedContent = (item) => {
    if (item?.id == selectedContent?.id) {
      setSelectedContent(null);
      setConSent(null);
    } else {
      setSelectedContent(item);
      setConSent(item.Consent);
    }
  };

  const handleOnSelectContent = () => {
    handleClose();
    debounce(paintEmail, 500)();
  };

  const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  const paintEmail = () => {
    sdk.setContent(conSent);
    sdk.setData({
      mapsKey: conSent,
    });
    localStorage.setItem("consent", conSent);
  };

  return (
    <>
      <div className="d-flex justify-content-center items-center vh-100 align-items-center">
        <Col
          className="d-flex justify-content-center"
          xs={4}
          md={4}
          lg={4}
          xl={4}
        >
          <Card className="custom-card">
            <Card.Body>
              <h6 className="card-title">Select a Content from CMS</h6>
              <Button
                className="mt-4"
                onClick={!isLoading ? openModal : null}
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Loading…" : "Browse"}
              </Button>
              <div>
                <h6 className="mt-4 text-break">{selectedContent?.Name}</h6>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </Button>
          </InputGroup>

          <Row className="files-content">
            {contents.map((item) => {
              return (
                <Col
                  onClick={() => handleSelectedContent(item)}
                  key={item.id}
                  xs={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className={"p-2 d-flex"}
                >
                  <Card
                    className={
                      "custom-file-content" +
                      (selectedContent?.id === item.id ? " content-active" : "")
                    }
                  >
                    <img
                      src="https://scbcare.scb.co.th/assets/images/services/scb-care-team.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <Card.Body>
                      <h6 className="mt-2">{item.Name}</h6>
                      <div dangerouslySetInnerHTML={{ __html: item.Consent }} />
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleOnSelectContent}>
            Select
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Home;
