import React from 'react';
import { render } from '@testing-library/react';

import ClearIcon from "../../icons/atoms/ClearIcon";
import IconInput from './IconInput';
import MenuIcon from "../../icons/atoms/MenuIcon";
import PersonIcon from "../../icons/atoms/PersonIcon";
import SearchIcon from "../../icons/atoms/SearchIcon";
import VisibilityIcon from "../../icons/atoms/VisibilityIcon";
import VpnKeyIcon from "../../icons/atoms/VpnKeyIcon";

describe(' IconInput', () => {
  it('should render clear icon successfully', () => {
    const { baseElement } = render(<IconInput icon={ClearIcon} />);
    expect(baseElement).toBeTruthy();
  });
});

describe(' IconInput', () => {
    it('should render menu icon successfully', () => {
      const { baseElement } = render(<IconInput icon={MenuIcon} />);
      expect(baseElement).toBeTruthy();
    });
});

describe(' IconInput', () => {
    it('should render person icon successfully', () => {
        const { baseElement } = render(<IconInput icon={PersonIcon} />);
        expect(baseElement).toBeTruthy();
    });
});


describe(' IconInput', () => {
    it('should render search icon successfully', () => {
        const { baseElement } = render(<IconInput icon={SearchIcon} />);
        expect(baseElement).toBeTruthy();
    });
});


describe(' IconInput', () => {
    it('should render visibility icon successfully', () => {
        const { baseElement } = render(<IconInput icon={VisibilityIcon} />);
        expect(baseElement).toBeTruthy();
    });
});


describe(' IconInput', () => {
    it('should render vpnkey icon successfully', () => {
        const { baseElement } = render(<IconInput icon={VpnKeyIcon} />);
        expect(baseElement).toBeTruthy();
    });
 });
