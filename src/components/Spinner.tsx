import * as React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import styles from "../styles";

const Spinner = () => (
  <ActivityIndicator
      animating={true}
      color={styles.spinner.color}
      // size={'large'}
      size={100}
  />
);

export default Spinner;