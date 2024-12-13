import React from "react";
import {
  Typography,
  IconButton,
  Card,
  CardBody,
} from "@material-tailwind/react";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
      <div className="mx-auto my-5">
        <Card className="rounded-lg bg-blue-950 text-white">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Company Info */}
              <div>
                <Typography variant="h6" className="mb-4 uppercase font-bold">
                  Company Name
                </Typography>
                <Typography className="text-sm text-gray-300">
                  Prescripto is a medical website that helps patients to book appointments with doctors and get prescriptions online.
                </Typography>
              </div>

              {/* Products */}
                <div>
                </div>

              {/* Contact */}
              <div>
                <Typography variant="h6" className="mb-4 uppercase font-bold">
                  Contact
                </Typography>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <Typography>
                      <i className="fas fa-home mr-2"></i>
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      <i className="fas fa-envelope mr-2"></i> nguyenanhquoc2123@gmail.com
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      <i className="fas fa-phone mr-2"></i> + 84 35575086
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      <i className="fas fa-print mr-2"></i> + 84 234 567 89
                    </Typography>
                  </li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <Typography variant="h6" className="mb-4 uppercase font-bold">
                  Follow us
                </Typography>
                <div className="flex space-x-4">
                  <IconButton
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FaFacebookF />
                  </IconButton>
                  <IconButton
                      size="sm"
                      className="bg-blue-400 hover:bg-blue-500 text-white"
                  >
                    <FaTwitter />
                  </IconButton>
                  <IconButton
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <FaGoogle />
                  </IconButton>
                  <IconButton
                      size="sm"
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    <FaInstagram />
                  </IconButton>
                  <IconButton
                      size="sm"
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                  >
                    <FaLinkedinIn />
                  </IconButton>
                  <IconButton
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-800 text-white"
                  >
                    <FaGithub />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 text-center">
              <Typography variant="small" className="text-gray-400">
                © 2024 Copyright:{" "}
                <a href="https://mdbootstrap.com/" className="text-teal-400">
                    Prescripto
                </a>
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
  );
};

export default Footer;
