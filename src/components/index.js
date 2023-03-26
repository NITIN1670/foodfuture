import React, { useState } from "react";
import axios from "axios";
import { nutriScore } from "nutri-score";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Index = () => {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [error, setError] = useState();
  const [foodInfo, setFoodInfo] = useState();
  const [nutritionData, setNutritionData] = useState([]);
  const [fileName, setFileName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const[color,setColor] = useState()
  const[score,setScore] = useState()
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF0000",
    "#008000",
    "#800080",
  ];
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setPreview(objectUrl);
  };
  const handleSumbit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      axios
        .post("https://nutrihealth.azurewebsites.net/uploadfile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          setFoodInfo(data);
          setIsLoading(true)
          axios
            .get("https://api.nal.usda.gov/fdc/v1/foods/search", {
              params: {
                query: data.Prediction,
                pageSize: 1,
                api_key: "6nFxfZFrywoqJ4PanhdbBVlWEUyIY6K6ejMJDYed",
              },
            })
            .then(({ data }) => {

              const nutrients = data.foods[0].foodNutrients.filter(
                (nutrient) =>
                  nutrient.nutrientName === "Energy" ||
                  nutrient.nutrientName === "Fat" ||
                  nutrient.nutrientName === "Protein" ||
                  nutrient.nutrientName === "Total lipid (fat)" ||
                  nutrient.nutrientName === "Cholesterol" ||
                  nutrient.nutrientName === "Carbohydrate, by difference"
              );
              setNutritionData(nutrients);
              setIsLoading(false)
              const energy = data.foods[0].foodNutrients.find(
                (obj) => obj.nutrientName === "Energy"
              );
              const fibers = data.foods[0].foodNutrients.find(
                (obj) => obj.nutrientName === "Fiber, total dietary"
              );
              const proteins = data.foods[0].foodNutrients.find(
                (obj) => obj.nutrientName === "Protein"
              );
              const saturated_fats = data.foods[0].foodNutrients.find(
                (obj) => obj.nutrientName === "Fatty acids, total saturated"
              );
              const sodium = data.foods[0].foodNutrients.find(
                (obj) => obj.nutrientName === "Sodium, Na"
              );
              const sugar = data.foods[0].foodNutrients.find(
                (obj) => obj.nutrientName === "Sugars, total including NLEA"
              );
              console.log(energy.value);
              console.log(fibers.value);
              console.log(proteins.value);
              console.log(saturated_fats.value);
              console.log(sodium.value);
              console.log(sugar.value);
              const result = nutriScore.calculateClass({
                energy: energy ? energy.value : 0,
                fibers: fibers ? fibers.value : 0,
                fruit_percentage: 0,
                proteins: proteins ? proteins.value : 0,
                saturated_fats: saturated_fats ? saturated_fats.value : 0,
                sodium: sodium ? sodium.value : 0,
                sugar: sugar ? sugar.value : 0,
              });
              setScore(result)
              if (result === 'A') {
                setColor('green');
              } else if (result === 'B') {
                setColor('lightgreen');
              } else if (result === 'C') {
                setColor('yellow');
              } else if (result === 'D') {
                setColor('orange');
              } else if (result === 'E') {
                setColor('red');
              }
            })
            .catch((error) => {
              setError("Could not process image!!. Please try again later.");
            });
        });
    } catch (ex) {
      alert("Error!!.Please try again later.");
    }
  };
  return (
    <div>
      <div
        className="register"
        style={{
          justifyContent: "center",
          display: "grid",
          fontSize: "xx-large",
        }}
      >
        <form onSubmit={(event) => handleSumbit(event)}>
          <h3>Get Feedback About Your Food</h3>
          <div className="form-group">
            <label htmlFor="image">Food Image: </label> <br></br>
            <input
              type="file"
              className="form-control"
              accept="image/png, image/jpeg"
              onChange={saveFile}
            />
            <br></br>
            {file && <img src={preview} width={400} height={400} />}
          </div>
          <br></br>
          {error && !foodInfo && (
            <label style={{ color: "red" }}>{error} &#128547;</label>
          )}{" "}
          <br></br>
          <input
            type="submit"
            className="btn btn-primary"
            value="Process Image"
          />
        </form>
        {foodInfo && (
          <div>
          <label style={{ color: "green" }}>
            Looks like someone in going to eat {foodInfo.Prediction} today 😋
          </label>
          <br></br>
          <h3 style={{ backgroundColor: color }}>NutriScore: {score}</h3>
          </div>
        
        )}{" "}
        <br></br>
        {
            isLoading ? (
              <div>Getting nutrition info for {foodInfo.Prediction}</div>
            ) : (
              <PieChart width={800} height={500}>
              <Pie
                data={nutritionData}
                dataKey="value"
                nameKey="nutrientName"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                colors={{ scheme: "random" }}
                label="Demo"
              >
                {nutritionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip
                formatter={(value, name, props) => [
                  `${name}: ${value} ${props.payload.unitName}`,
                ]}
              />
            </PieChart>
            )
        }
     
      </div>
    </div>
  );
};
export default Index;
