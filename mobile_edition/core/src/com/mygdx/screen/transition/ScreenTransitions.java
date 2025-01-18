package com.mygdx.screen.transition;

import com.badlogic.gdx.math.Interpolation;
import com.mygdx.util.Direction;
import com.mygdx.util.screen.transitions.ScreenTransition;
import com.mygdx.util.screen.transitions.implement.FadeScreenTransition;
import com.mygdx.util.screen.transitions.implement.ScaleScreenTransition;
import com.mygdx.util.screen.transitions.implement.SlideScreenTransition;

public final class ScreenTransitions {

    public static final ScreenTransition FADE = new FadeScreenTransition(1.5f);
    //public static final ScreenTransition SCALE = new ScaleScreenTransition(2.0f);
    public static final ScreenTransition SCALE = new ScaleScreenTransition(2.0f, true, Interpolation.bounceOut);
    //public static final ScreenTransition SLIDE = new SlideScreenTransition(5.0f);
    public static final ScreenTransition SLIDE = new SlideScreenTransition(1.5f, true, Direction.DOWN, Interpolation.swingIn);

    private ScreenTransitions(){}

}
