import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Box, Container, CircularProgress } from "@mui/material";
import { FaLocationArrow } from "react-icons/fa";
import { LuTreeDeciduous } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { TbCircleNumber9 } from "react-icons/tb";
import { BiRuler } from "react-icons/bi";
import { LiaStampSolid } from "react-icons/lia";
import { HiOutlineIdentification } from "react-icons/hi";
import { generateCertificate } from "../redux/slicer/certificateSlice";

export default function GenerateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const numberField = useRef();
  const ownerField = useRef();
  const provinceField = useRef();
  const addressField = useRef();
  const cityField = useRef();
  const lengthField = useRef();
  const issueDateField = useRef();
  const validatorField = useRef();
  const nipField = useRef();

  const handleClickLink = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/certificate/all";
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingGenerate(true);
    try {
      const generatePayload = {
        number: parseFloat(numberField.current.value),
        owner: ownerField.current.value,
        province: provinceField.current.value,
        address: addressField.current.value,
        city: cityField.current.value,
        length: lengthField.current.value,
        issueDate: issueDateField.current.value,
        validator: validatorField.current.value,
        nip: nipField.current.value,
      };

      const response = await dispatch(generateCertificate(generatePayload));
      const createResponse = response.payload;

      setIsLoadingGenerate(false);
      if (createResponse && createResponse.status) {
        enqueueSnackbar(`${createResponse.message} `, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        setIsLoadingGenerate(false);
        numberField.current.value = null;
        ownerField.current.value = "";
        provinceField.current.value = "";
        addressField.current.value = "";
        cityField.current.value = "";
        lengthField.current.value = "";
        issueDateField.current.value = "";
        validatorField.current.value = "";
        nipField.current.value = "";
      } else {
        enqueueSnackbar(`${response.error.message}`, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar(`Failed to generate certificate ${error}`, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Link
          to="/"
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            fontSize: "1.4em",
            color: "green",
            userSelect: "none",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Incrypt
        </Link>
        <Box className="wrapper wrapper-generate">
          <Box className="form-box register">
            <h2>Generate</h2>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <TbCircleNumber9 />
                    </span>
                    <input
                      type="text"
                      required
                      ref={numberField}
                      autoComplete="on"
                    />
                    <label>NIB</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <AiOutlineUserAdd />
                    </span>
                    <input type="text" required ref={ownerField} />
                    <label>Owner</label>
                  </Box>

                  <Box className="input-box">
                    <span className="icon">
                      <MdOutlineMapsHomeWork />
                    </span>
                    <input type="text" required ref={provinceField} />
                    <label>Province</label>
                  </Box>
                </Box>
                <Box>
                  <Box className="input-box">
                    <span className="icon">
                      <GrLocation />
                    </span>
                    <input type="text" required ref={addressField} />
                    <label>Address</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <LuTreeDeciduous />
                    </span>
                    <input required type="text" ref={cityField} />
                    <label>City</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <BiRuler />
                    </span>
                    <input required ref={lengthField} />
                    <label>Length</label>
                  </Box>
                </Box>
                <Box>
                  <Box className="input-box">
                    <input
                      required
                      type="date"
                      style={{ paddingRight: "5px" }}
                      ref={issueDateField}
                    />
                    <label style={{ top: "0" }}>Issue Date</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <LiaStampSolid />
                    </span>
                    <input required type="text" ref={validatorField} />
                    <label>Validator</label>
                  </Box>
                  <Box className="input-box">
                    <span className="icon">
                      <HiOutlineIdentification />
                    </span>
                    <input required type="text" ref={nipField} />
                    <label>Validator Nip</label>
                  </Box>
                </Box>
              </Box>
              <button type="submit" className="btn">
                {isLoadingGenerate ? "Generating..." : "Generate"}
              </button>

              <Box className="login-register">
                <p>
                  See your certificate ?
                  <Link
                    onClick={handleClickLink}
                    className="login-link"
                    style={{ marginLeft: "10px" }}
                  >
                    Certificate
                    {isLoading ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          paddingLeft: "5px",
                        }}
                      >
                        <CircularProgress
                          style={{
                            width: "15px",
                            color: "#31233D",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "0",
                          }}
                        />
                      </span>
                    ) : (
                      <FaLocationArrow
                        style={{ marginLeft: "5px", width: "10px" }}
                      />
                    )}
                  </Link>
                </p>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}
