import {  useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useCallback } from 'react';
import Food from '../../components/Food';


interface FoodObject {
  id: number,
  name: string,
  description: string,
  price: number,
  available: boolean,
  image: string,
}


interface DashboardProps{
  foods: FoodObject[],
  modalOpen: boolean,
  editModalOpen: boolean
}


const Dashboard:React.FC<DashboardProps> = (props) => {
 const [foods, setFoods] = useState<FoodObject[]>([]);
 const [modalOpen, setModalOpen] = useState(false);
 const [editModalOpen, setEditModalOpen] = useState(false);
 const [editingFood, setEditingFood] = useState<FoodObject>({} as FoodObject);

  useEffect(()=> { 
    api.get('/foods').then((response)=>
      setFoods(response.data)
    );
  },[setFoods])

  const handleAddFood =useCallback(async (food: FoodObject) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  },[setFoods, foods]);

  const handleUpdateFood = useCallback (async (food:FoodObject) => {
  
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setFoods(foodsUpdated)
     
    } catch (err) {
      console.log(err);
    }
  },[setFoods, editingFood, foods]);

  const handleDeleteFood = useCallback(async (id:number) => {
    

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    
    setFoods(foodsFiltered);
  },[setFoods, foods]);

  const toggleModal = useCallback(() => {   
    setModalOpen(!modalOpen );
  },[setModalOpen, modalOpen]);

  const toggleEditModal = useCallback (() => {
    setEditModalOpen(!editModalOpen);
  },[setEditModalOpen, editModalOpen]);

  const handleEditFood = useCallback((food:FoodObject) => {
    
    setEditingFood(food);
    setEditModalOpen(true);
  },[setEditModalOpen, setEditingFood]);



    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map((food: FoodObject) => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );

};

export default Dashboard;
