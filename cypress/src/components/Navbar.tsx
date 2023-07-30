import styled from 'styled-components';

const NavContainer = styled.nav`
  min-height: 3.25rem;
  position: relative;
  margin-bottom: 1rem;
  background: #f4f4f4;
`;

const Title = styled.span`
  display: inline-block;
  font-weight: bold;
  padding: 1rem;
`;

const Navbar = () => {
  return (
    <NavContainer role='navigation' aria-label='main navigation'>
      <Title>Grow Therapy SDET Take Home</Title>
    </NavContainer>
  );
};

export default Navbar;
