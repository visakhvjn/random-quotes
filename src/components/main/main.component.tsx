import { Quote } from "../quote/quote.component";
import { ButtonGroup } from "baseui/button-group";
import { Button, SIZE, KIND } from "baseui/button";
import { Block } from 'baseui/block';
import { useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ImBullhorn, ImCopy } from "react-icons/im";
import { HiVolumeOff } from "react-icons/hi";
import { MonoHeadingXXLarge, MonoParagraphLarge } from "baseui/typography";


export const Main = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCoped, setIsCoped] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const promotionText = `\n\nDiscover more such quotes at - ${window.location.origin}`;

    const handleSpeakClick = (text: string) => {

        if (isSpeaking) {
            window.speechSynthesis.cancel();
        } else {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);

            speech.onend = () => {
                setIsSpeaking(false);
            };
        }
        
        setIsSpeaking(!isSpeaking);
    };

    const onCopy = () => {
        setIsCoped(true);
    }

    const fetchNewQuote = async () => {
        setIsLoading(true);

        const response = await fetch(
            'https://api.api-ninjas.com/v1/quotes',
            {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'WZl9PgOgZcA+7LYsJTyIkg==SxDi8ufcTDJRpl3i'
                }
            }
        );

        const data = await response.json();

        setQuote(data[0].quote);
        setAuthor(data[0].author);

        setIsCoped(false);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchNewQuote();
    }, []);

    return (
        <div style={{ padding: '5% 10% 5% 10%'}}>
            <Block style={{ display: 'block', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <MonoHeadingXXLarge>QuoteQuest</MonoHeadingXXLarge>
                <MonoParagraphLarge style={{ marginTop: '-1%'}}>Discover-Wisdom-at-Your-Fingertips</MonoParagraphLarge>
            </Block>
            <Block style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Quote text={quote} author={author} />
            </Block>
            <Block style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
                <ButtonGroup>
                    {('speechSynthesis' in window) ? <Button 
                    startEnhancer={() => isSpeaking ? <HiVolumeOff /> : <ImBullhorn /> }
                    style={{ marginRight: '10px' }}
                    disabled={isLoading}
                    onClick={() => handleSpeakClick(quote)}>{ isSpeaking ? 'Silence' : 'Speak' }</Button> : <></>}
                    <Button
                        disabled={isSpeaking}
                        style={{ marginRight: '10px'}}
                        overrides={{
                            BaseButton: {
                              style: ({ $theme }) => ({
                                backgroundColor: $theme.colors.black,
                                color: $theme.colors.white,
                                ':hover': {
                                    backgroundColor: $theme.colors.black
                                }
                              })
                            }
                          }}
                        kind={KIND.primary}
                        onClick={fetchNewQuote}
                        size={SIZE.compact}
                        isLoading={isLoading}
                    >Next Quote</Button>
                    <CopyToClipboard onCopy={onCopy} text={`'${quote}' ~${author}` + promotionText}>
                    <Button
                        startEnhancer={() => <ImCopy />}
                        kind={KIND.secondary}
                    >{isCoped ? 'Copied!' : 'Copy'}</Button>
                    </CopyToClipboard>
                </ButtonGroup>
            </Block>
        </div>
    );
};