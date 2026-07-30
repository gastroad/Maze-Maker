import Cabinet from '@components/templates/Cabinet';
import Loader from '@components/atoms/Loader';

export default function Loading() {
  return (
    <Cabinet screenLabel="Loading">
      <Loader />
    </Cabinet>
  );
}
