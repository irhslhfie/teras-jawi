"use client";
import Layout from "@/components/layout";
import GradientCircularProgress from "@/components/Progress";
import AuthWrapper from "@/helpers/AuthWrapper";
import {
  useGetPlaystationById,
  useUpdatePlaystation,
} from "@/hooks/playstation/usePlaystation";
import { Box, Button, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UpdatePlaystation = () => {
  const router = useRouter();
  const param = useParams();
  const { ps_id } = param;
  const [formData, setFormData] = useState({
    branch_id: "",
    ps_type: "",
    ps_number: "",
  });
  const {
    data: dataPlaystation,
    isLoading,
    error,
    isSuccess: dataPlaystationSukses,
  } = useGetPlaystationById({
    ps_id: ps_id,
  });
  const {
    data: dataCabang,
    isLoading: branchLoading,
    error: branchError,
  } = useGetBranchAll();

  useEffect(() => {
    if (dataPlaystation) {
      setFormData({
        branch_id: dataPlaystation?.playstation?.branch_id,
        ps_type: dataPlaystation?.playstation?.ps_type,
        ps_number: dataPlaystation?.playstation?.ps_number,
      });
    } else {
      console.log("Data PlayStation error");
    }
  }, [dataPlaystationSukses, dataPlaystation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updatePlaystation = useUpdatePlaystation({
    ps_id: ps_id,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cek Data Input---", formData);

    try {
      await updatePlaystation.mutateAsync({
        branch_id: formData?.branch_id,
        ps_type: formData?.ps_type,
        ps_number: formData?.ps_number,
      });
      router.back();
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  console.log(dataPlaystation?.playstation?.length + "---");

  return (
    <AuthWrapper allowedRoles={["admin", "owner"]}>
      <Layout>
        <Box
          sx={{
            maxWidth: "100%",
            minHeight: 400,
            mx: "auto",
            mt: 5,
            backgroundColor: "#ffffff",
            py: 3,
            px: 4,
            borderRadius: "12px",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 5 }}>
            Update Data PlayStation
          </Typography>
          {isLoading && branchLoading && (
            <div className="w-full flex justify-center items-center mt-10">
              <GradientCircularProgress />
            </div>
          )}
          {error && branchError && (
            <div className="w-full flex justify-center items-center mt-10">
              <Typography color="error">
                Error fetching data: {error.message}
              </Typography>
            </div>
          )}
          {!isLoading && !branchLoading && dataPlaystation?.playstation && (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Nama Cabang
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData?.branch_id}
                  name="branch_id"
                  label="Nama Cabang"
                  onChange={handleChange}
                >
                  {dataCabang?.length <= 0 && (
                    <MenuItem value="">Belum ada data cabang!</MenuItem>
                  )}
                  {dataCabang?.length > 0 &&
                    dataCabang?.map((cabang) => (
                      <MenuItem
                        key={cabang?.branch_id}
                        value={cabang?.branch_id}
                      >
                        {cabang?.branch_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  Jenis PlayStation
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData?.ps_type}
                  name="ps_type"
                  label="Jenis PlayStation"
                  onChange={handleChange}
                >
                  <MenuItem value={"PS3"}>PS3</MenuItem>
                  <MenuItem value={"PS4"}>PS4</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Nomor PS"
                name="ps_number"
                value={formData?.ps_number}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <div className="flex justify-between mt-5">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="medium"
                >
                  Update PlayStation
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    router.back();
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          )}
        </Box>
      </Layout>
    </AuthWrapper>
  );
};

export default UpdatePlaystation;
