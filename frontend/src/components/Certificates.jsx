import React from "react";
import { useDispatch } from "react-redux";
import { Container, Paper, Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";
import { getAllCertificates } from "../redux/slicer/certificateSlice";
import { VscSend } from "react-icons/vsc";
import { Link } from "react-router-dom";
import useSWR from "swr";
import bpnImage from "../assets/Images/bpn.png";
import garuda from "../assets/Images/garuda.png";
import denah from "../assets/Images/denah.png";
import stempel from "../assets/Images/stempel.png";
import ttd from "../assets/Images/ttd.png";

export default function Certificates() {
  const dispatch = useDispatch();

  const { data: certificateData } = useSWR("certificates", () =>
    dispatch(getAllCertificates())
  );
  const renderCertificates = () => {
    if (certificateData) {
      const certificateArray = certificateData.payload.data;

      return Array.isArray(certificateArray)
        ? certificateArray.map((certificate, index) => {
            const qrValue = `${certificate.hash}`;
            return (
              <>
                <Paper
                  key={index}
                  sx={{
                    width: "70%",
                    padding: "15px",
                    boxShadow: "0 0 10px rgba(0,0,0,1)",
                    marginBottom: "20px",
                    position: "relative",
                    display: "flex",
                  }}
                >
                  <img
                    src={bpnImage}
                    alt=""
                    style={{
                      position: "absolute",
                      width: "50%",
                      margin: "170px",
                      padding: "70px 0",
                      opacity: 0.2,
                    }}
                  />
                  <div style={{ width: "7%", alignSelf: "center", opacity: 1 }}>
                    <Typography
                      style={{
                        textTransform: "uppercase",
                        fontSize: "16px",
                        color: "darkred",
                        writingMode: "vertical-lr",
                        letterSpacing: "0.1em",
                        transform: "rotate(180deg) ",
                        display: "inline",
                        height: "max-content",
                        fontWeight: "bolder",
                      }}
                    >
                      sertipikat ini diterbitkan oleh kementrian agraria dan
                      tata ruang/badan pertanahan nasional{" "}
                    </Typography>
                  </div>
                  <div style={{ width: "93%", opacity: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        marginBottom: "10px",
                      }}
                    >
                      <Link
                        to={`/certificate/transfer/${certificate.number}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          textTransform: "capitalize",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#2b0342",
                          justifyContent: "end",
                          width: "22%",
                        }}
                      >
                        Transfer
                        <VscSend />
                      </Link>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{ display: "flex", width: "40%", gap: "5px" }}
                      >
                        <img
                          src={bpnImage}
                          alt=""
                          style={{ width: "50px", height: "50px" }}
                        />
                        <Typography
                          style={{
                            textTransform: "uppercase",
                            fontSize: "10.5px",
                            fontWeight: "bold",
                          }}
                        >
                          kementrian agraria dan tata ruang badan pertanahan
                          nasional republik indonesia
                        </Typography>
                      </div>
                      <div style={{ width: "20%", textAlign: "center" }}>
                        <img src={garuda} alt="" style={{ width: "80px" }} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "40%",
                          justifyContent: "end",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <Typography
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              textAlign: "end",
                              textTransform: "uppercase",
                            }}
                          >
                            {certificate.hash && certificate.hash.slice(5, 12)}{" "}
                          </Typography>
                          <Typography
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            Di: 208 /{" "}
                            {certificate.issueDate &&
                              certificate.issueDate.split("T")[0]}
                          </Typography>
                        </div>
                        <QRCode
                          value={qrValue}
                          size={50}
                          fgColor="black"
                          bgColor="transparent"
                          style={{ marginBottom: "20px" }}
                        />
                      </div>
                    </div>

                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      Sertipikat
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      Hak Milik/{" "}
                      <span style={{ textDecoration: "line-through" }}>
                        Tanah Wakaf
                      </span>
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: "600",
                        marginBottom: "20px",
                      }}
                    >
                      NIB : {certificate.number}
                    </Typography>

                    <div style={{ paddingRight: "30px" }}>
                      <Typography
                        sx={{
                          color: "black",
                          paddingBottom: "10px",
                          fontSize: "12px",
                          marginBottom: "10px",
                        }}
                      >
                        Hak milik ini terletak di Jalan {certificate.address},
                        Desa/Kelurahan {certificate.address.split(" ")[2]},
                        Kecamatan {certificate.address.split(" ")[2]},
                        Kabupaten.Kota {certificate.city}, Provinsi{" "}
                        {certificate.province}, seluas {certificate.length} m2,
                        dengan jangka waktu{" "}
                        {certificate.issueDate.split("T")[0]}
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        Pemegang Hak Milik /nazhir/ : {certificate.owner}
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", paddingRight: "5px" }}
                        >
                          Berdasarkan
                        </span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nobis voluptates laboriosam asperiores laborum, nemo
                        inventore assumenda saepe corporis cupiditate ducimus?
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Batasan :
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", paddingRight: "5px" }}
                        >
                          1.
                        </span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nobis voluptates laboriosam asperiores
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", paddingRight: "5px" }}
                        >
                          2.
                        </span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nobis voluptates laboriosam asperiores
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Kewajiban :
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", paddingRight: "5px" }}
                        >
                          1.
                        </span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nobis voluptates laboriosam asperiores
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", paddingRight: "5px" }}
                        >
                          2.
                        </span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nobis voluptates laboriosam asperiores
                      </Typography>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        bidang tanah/denah ruang :
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            height: "180px",
                            border: "2px solid black",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            zIndex: 1,
                            marginRight: "30px",
                          }}
                        >
                          <img src={denah} alt="" style={{ width: "60%" }} />
                        </div>
                        <div style={{ width: "40%" }}>
                          <Typography
                            style={{ fontSize: "14px", marginBottom: "5px" }}
                          >
                            Bidang tanah ini telah diukur berdasarkan Surat
                            Ukur/Gambar Denah/Surat Ukur Ruang tanggal{" "}
                            {certificate.issueDate.split("T")[0]}{" "}
                          </Typography>
                          <QRCode
                            value={qrValue}
                            size={50}
                            fgColor="black"
                            bgColor="transparent"
                            style={{ marginBottom: "20px" }}
                          />
                        </div>
                      </div>
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          marginTop: "10px",
                        }}
                      >
                        <p style={{ fontWeight: "bold" }}>Catatan</p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "normal",
                            color: "black",
                            marginBottom: "30px",
                          }}
                        >
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Enim molestiae neque animi quis voluptas eum
                          possimus voluptatem ullam debitis obcaecati.
                        </p>
                      </Typography>

                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "2px solid black",
                          paddingBottom: "10px",
                        }}
                      >
                        <div style={{ alignSelf: "end" }}>
                          <Typography
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            Kantor Pertanahan
                          </Typography>
                          <Typography
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            Alamat: Jl. MT Haryono No.3
                          </Typography>
                        </div>
                        <div style={{ position: "relative" }}>
                          <img
                            src={stempel}
                            alt=""
                            style={{
                              width: "100px",
                              position: "absolute",
                              top: "10px",
                              left: "0",
                            }}
                          />
                          <Typography
                            style={{ fontSize: "14px", fontWeight: "bold" }}
                          >
                            Jabatan yang mengesahkan
                          </Typography>
                          <img
                            src={ttd}
                            alt=""
                            style={{ width: "70px", marginLeft: "60px" }}
                          />
                          <span>
                            <Typography
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              {certificate.validator
                                ? certificate.validator
                                : "Nama Pengesah"}
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Nip:{" "}
                              {certificate.nip ? certificate.nip : "123456789"}
                            </Typography>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Paper>
              </>
            );
          })
        : "";
    }
  };

  return (
    <>
      <Container sx={{ marginTop: "80px" }}>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {renderCertificates()}
        </Box>
      </Container>
    </>
  );
}
